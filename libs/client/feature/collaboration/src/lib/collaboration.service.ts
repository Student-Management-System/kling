import { Injectable } from "@angular/core";
import {
	Chat,
	ChatMessageEvent,
	connectAnonymously,
	ConvergenceDomain,
	ModelCollaborator,
	RealTimeElement,
	RealTimeModel,
	RealTimeString
} from "@convergence/convergence";
import { WorkspaceActions } from "@kling/client/data-access/state";
import { ExecuteResponse } from "@kling/ide-services";
import { Directory, File } from "@kling/programming";
import { Store } from "@ngrx/store";
import { nanoid } from "nanoid";
import { BehaviorSubject, Subscription } from "rxjs";

type DataModel = {
	files: {
		[path: string]: File;
	};
	directories: Directory[];
	selectedByUser: {
		[username: string]: string | null;
	};
	terminal: {
		input: string;
		output: ExecuteResponse | null;
	};
};

@Injectable({ providedIn: "root" })
export class CollaborationService {
	readonly activeSessionId$ = new BehaviorSubject<string | null>(null);
	readonly collaborators$ = new BehaviorSubject<ModelCollaborator[]>([
		{
			sessionId: "abc",
			user: {
				displayName: "Mustermann1"
			} as any
		},
		{
			sessionId: "abc",
			user: {
				displayName: "Mustermann2"
			} as any
		},
		{
			sessionId: "abc",
			user: {
				displayName: "Mustermann3"
			} as any
		}
	]);

	readonly messages$ = new BehaviorSubject<ChatMessageEvent[]>(
		(() => {
			const messages = [];
			for (let i = 0; i < 5; i++) {
				messages.push({
					message: "Hello world",
					user: {
						displayName: "Mustermann1"
					} as any
				} as any);
			}
			return messages;
		})()
	);

	public model!: RealTimeModel;

	private chat!: Chat;
	private domain!: ConvergenceDomain;
	private convergenceUrl = "http://localhost:8000/api/realtime/convergence/default" as const;
	private subscriptions: Subscription[] = [];

	constructor(private readonly store: Store) {}

	async createSession(
		username: string,
		project: {
			files: File[];
			directories: Directory[];
			selectedFile: string | null;
		}
	): Promise<string> {
		await this.connectToConvergence(username);

		const sessionId = nanoid(6);

		const files: { [path: string]: File } = {};
		project.files.forEach(file => {
			files[file.path] = file;
		});

		const data: DataModel = {
			files,
			directories: project.directories,
			selectedByUser: {
				[username]: project.selectedFile
			},
			terminal: {
				input: "",
				output: null
			}
		};

		await this.createModel(sessionId, data);
		await this.joinSession(username, sessionId);

		return sessionId;
	}

	private async createModel(sessionId: string, data: DataModel): Promise<RealTimeModel> {
		try {
			console.log("Convergence: Creating model for session " + sessionId);
			return await this.domain.models().openAutoCreate({
				collection: "collaboration",
				id: sessionId,
				ephemeral: false,
				data
			});
		} catch (error) {
			console.error("Convergence: Failed to create model");
			console.error(error);
			throw error;
		}
	}

	private async connectToConvergence(username: string): Promise<void> {
		try {
			console.log("Convergence: Connecting...");
			this.domain = await connectAnonymously(this.convergenceUrl, username);
			console.log("Convergence: Connected");
		} catch (error) {
			console.error("Convergence: Failed to connect");
			console.error(error);
			throw error;
		}
	}

	async joinSession(username: string, id: string): Promise<void> {
		if (!this.domain?.isConnected()) {
			await this.connectToConvergence(username);
		}

		console.log("Convergence: Joining session " + id);
		this.model = await this.domain.models().open(id);

		const data = this.model.root().value() as DataModel;

		this.store.dispatch(
			WorkspaceActions.loadProject({
				projectName: `share-${id}`,
				files: Object.values(data.files),
				directories: data.directories
			})
		);

		this.model.collaboratorsAsObservable().subscribe(collaborators => {
			this.collaborators$.next(collaborators);
		});

		console.log("Convergence: Joined session " + id);
		this.activeSessionId$.next(id);
	}

	getRealTimeFile(path: string): RealTimeString {
		return this.model.root().elementAt(["files", path, "content"]) as RealTimeString;
	}

	async sendChatMessage(text: string): Promise<void> {
		if (text.length > 0) {
			await this.chat.send(text);
		}
	}

	private async joinChat(id: string): Promise<void> {
		try {
			this.chat = await this.domain.chat().join(id);

			await this.sendChatMessage("[Joined]");

			this.chat.on("message", event => {
				this.messages$.next([...this.messages$.getValue(), event as ChatMessageEvent]);
			});
		} catch (error) {
			console.error("Convergence: Failed to connect to chat");
			console.error(error);
			throw error;
		}
	}

	async disconnect(): Promise<void> {
		this.subscriptions.forEach(s => s.unsubscribe());
		await this.domain?.disconnect();
		this.activeSessionId$.next(null);
	}
}
