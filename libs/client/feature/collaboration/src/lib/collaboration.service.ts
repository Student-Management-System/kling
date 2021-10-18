import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
	Chat,
	ChatMessageEvent,
	connectAnonymously,
	ConvergenceDomain,
	ModelCollaborator,
	RealTimeElement,
	RealTimeModel
} from "@convergence/convergence";
import { Directory, File } from "@kling/programming";
import { nanoid } from "nanoid";
import { BehaviorSubject, Subscription } from "rxjs";

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

	private chat!: Chat;
	private domain!: ConvergenceDomain;

	public model!: RealTimeModel;

	private convergenceUrl = "http://localhost:8000/api/realtime/convergence/default";

	private subscriptions: Subscription[] = [];

	constructor() {}

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

		const files: { [path: string]: string } = {};
		project.files.forEach(file => {
			files[file.path] = file.content;
		});

		this.model = await this.createModel(sessionId, files, project, username);

		this.model.collaboratorsAsObservable().subscribe(collaborators => {
			this.collaborators$.next(collaborators);
		});

		//await this.joinChat(sessionId);

		this.activeSessionId$.next(sessionId);

		return sessionId;
	}

	private async createModel(
		sessionId: string,
		files: { [path: string]: string },
		project: { files: File[]; directories: Directory[]; selectedFile: string | null },
		username: string
	): Promise<RealTimeModel> {
		try {
			return await this.domain.models().openAutoCreate({
				collection: "collaboration",
				id: sessionId,
				ephemeral: false,
				data: {
					files,
					directories: project.directories,
					selectedByUser: {
						[username]: project.selectedFile
					},
					terminal: {
						input: "",
						output: null
					}
				}
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
		await this.connectToConvergence(username);

		this.model = await this.domain.models().open(id);

		//await this.joinChat(id);

		this.activeSessionId$.next(id);

		this.model
			.root()
			.events()
			.subscribe(event => {
				console.log(event);
			});

		this.model.collaboratorsAsObservable().subscribe(collaborators => {
			this.collaborators$.next(collaborators);
		});
	}

	getRealTimeFile(path: string): RealTimeElement<string> {
		return this.model.root().elementAt(["files", path]);
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
