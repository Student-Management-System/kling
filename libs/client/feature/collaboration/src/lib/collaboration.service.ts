import { Injectable } from "@angular/core";
import {
	Chat,
	ChatMessageEvent,
	connectAnonymously,
	ConvergenceDomain,
	ModelChangedEvent,
	ModelCollaborator,
	ObjectRemoveEvent,
	ObjectSetEvent,
	RealTimeModel,
	RealTimeObject,
	RealTimeString
} from "@convergence/convergence";
import {
	DirectoryActions,
	FileActions,
	FileSelectors,
	WorkspaceActions
} from "@kling/client/data-access/state";
import { ExecuteResponse } from "@kling/ide-services";
import { Directory, File } from "@kling/programming";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { nanoid } from "nanoid";
import { BehaviorSubject, Subscription } from "rxjs";

type DataModel = {
	files: {
		[path: string]: File;
	};
	directories: {
		[path: string]: Directory;
	};
	selectedFile: string | null;
	terminal: {
		input: string;
		output: ExecuteResponse | null;
	};
};

@Injectable({ providedIn: "root" })
export class CollaborationService {
	readonly activeSessionId$ = new BehaviorSubject<string | null>(null);
	readonly collaborators$ = new BehaviorSubject<ModelCollaborator[]>([]);
	readonly messages$ = new BehaviorSubject<ChatMessageEvent[]>([]);

	private model!: RealTimeModel;
	private chat!: Chat;
	private domain!: ConvergenceDomain;
	private convergenceUrl = "http://localhost:8000/api/realtime/convergence/default" as const;
	private subscriptions: Subscription[] = [];

	constructor(private readonly store: Store, private readonly actions$: Actions) {}

	async createSession(
		username: string,
		project: {
			name?: string;
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

		const directories: { [path: string]: Directory } = {};
		project.directories.forEach(dir => {
			directories[dir.path] = dir;
		});

		const data: DataModel = {
			files,
			directories,
			selectedFile: project.selectedFile ?? "", // Fallback to empty string to prevent Convergence errors
			terminal: {
				input: "",
				output: null
			}
		};

		await this.createModel(sessionId, data);
		await this.joinSession(username, sessionId, project.name);

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

	async joinSession(username: string, sessionId: string, projectName?: string): Promise<void> {
		if (!this.domain?.isConnected()) {
			await this.connectToConvergence(username);
		}

		console.log("Convergence: Joining session " + sessionId);
		this.model = await this.domain.models().open(sessionId);

		console.log("Convergence: Joined session " + sessionId);
		this.activeSessionId$.next(sessionId);

		const data = this.model.root().value() as DataModel;

		this.store.dispatch(
			WorkspaceActions.loadProject({
				projectName: projectName ?? `share-${sessionId}`,
				files: Object.values(data.files),
				directories: Object.values(data.directories)
			})
		);

		this.store.dispatch(FileActions.setSelectedFile({ path: data.selectedFile }));

		this.subscribeToEvents();
	}

	private subscribeToEvents() {
		this.subscriptions.push(
			this.actions$.pipe(ofType(FileActions.addFile)).subscribe(async ({ file }) => {
				const files = this.model.root().elementAt("files") as RealTimeObject;
				files.set(file.path, file);
			}),

			this.actions$.pipe(ofType(FileActions.deleteFile)).subscribe(async ({ file }) => {
				const files = this.model.root().elementAt("files") as RealTimeObject;
				files.remove(file.path);
			}),

			this.store.select(FileSelectors.selectSelectedFilePath).subscribe(path => {
				this.model
					.root()
					.elementAt("selectedFile")
					.value(path ?? "");
			}),

			this.actions$
				.pipe(ofType(DirectoryActions.addDirectory))
				.subscribe(async ({ directory }) => {
					const directories = this.model
						.root()
						.elementAt("directories") as RealTimeObject;
					directories.set(directory.path, directory);
				}),

			this.actions$
				.pipe(ofType(DirectoryActions.deleteDirectory))
				.subscribe(async ({ directory }) => {
					const directories = this.model
						.root()
						.elementAt("directories") as RealTimeObject;
					directories.remove(directory.path);
				}),

			this.model
				.root()
				.get("selectedFile")
				.events()
				.subscribe(e => {
					if (e instanceof ModelChangedEvent && !e.local) {
						const selectedFilePath = this.model.root().get("selectedFile").value();
						const path = selectedFilePath?.length > 1 ? selectedFilePath : null;
						this.store.dispatch(FileActions.setSelectedFile({ path }));
					}
				}) as any,

			this.model
				.root()
				.get("files")
				.events()
				.subscribe(e => {
					if (e instanceof ObjectSetEvent && !e.local) {
						this.store.dispatch(FileActions.addFile({ file: e.value.value() }));
					} else if (e instanceof ObjectRemoveEvent && !e.local) {
						this.store.dispatch(FileActions.deleteFile({ file: e.oldValue.value() }));
					}
				}) as any,

			this.model
				.root()
				.get("directories")
				.events()
				.subscribe(e => {
					if (e instanceof ObjectSetEvent && !e.local) {
						this.store.dispatch(
							DirectoryActions.addDirectory({ directory: e.value.value() })
						);
					} else if (e instanceof ObjectRemoveEvent && !e.local) {
						this.store.dispatch(
							DirectoryActions.deleteDirectory({ directory: e.oldValue.value() })
						);
					}
				}) as any,

			this.model.collaboratorsAsObservable().subscribe(collaborators => {
				this.collaborators$.next(collaborators);
			}) as any
		);
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

	async disconnect(): Promise<void> {
		this.subscriptions.forEach(s => s.unsubscribe());
		await this.domain?.disconnect();
		this.activeSessionId$.next(null);
		this.collaborators$.next([]);
		this.messages$.next([]);
	}
}
