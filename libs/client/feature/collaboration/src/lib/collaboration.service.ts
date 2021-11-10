import { Inject, Injectable, InjectionToken } from "@angular/core";
import {
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
	StudentMgmtSelectors,
	WorkspaceActions
} from "@web-ide/client/data-access/state";
import { ExecuteResponse } from "@web-ide/ide-services";
import { Directory, File } from "@web-ide/programming";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { nanoid } from "nanoid";
import { BehaviorSubject, firstValueFrom, Subscription } from "rxjs";

export const CONVERGENCE_REALTIME_API_URL = new InjectionToken<string>(
	"URL of the Convergence Realtime API"
);

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
		output: {
			isRunning: boolean;
			result: ExecuteResponse | null;
		};
	};
};

@Injectable({ providedIn: "root" })
export class CollaborationService {
	readonly activeSessionId$ = new BehaviorSubject<string | null>(null);
	readonly collaborators$ = new BehaviorSubject<ModelCollaborator[] | null>(null);

	private model!: RealTimeModel;
	private domain!: ConvergenceDomain;
	private subscriptions: Subscription[] = [];

	constructor(
		private readonly store: Store,
		private readonly actions$: Actions,
		@Inject(CONVERGENCE_REALTIME_API_URL) private readonly convergenceUrl: string
	) {}

	async createSession(project: {
		name?: string;
		files: File[];
		directories: Directory[];
		selectedFile: string | null;
	}): Promise<string> {
		await this.connectToConvergence();

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
				output: {
					isRunning: false,
					result: {
						run: {
							stdout: null,
							stderr: null
						} as any,
						compile: {
							stdout: null,
							stderr: null
						} as any
					} as any
				}
			}
		};

		await this.createModel(sessionId, data);
		await this.joinSession(sessionId, project.name);

		return sessionId;
	}

	private async createModel(sessionId: string, data: DataModel): Promise<RealTimeModel> {
		try {
			console.log("Convergence: Creating model for session " + sessionId);
			return await this.domain.models().openAutoCreate({
				collection: "collaboration",
				id: sessionId,
				ephemeral: true,
				data
			});
		} catch (error) {
			console.error("Convergence: Failed to create model");
			console.error(error);
			throw error;
		}
	}

	async joinSession(sessionId: string, projectName?: string): Promise<void> {
		if (!this.domain?.isConnected()) {
			await this.connectToConvergence();
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
			this.actions$.pipe(ofType(FileActions.addFile)).subscribe(({ file, remote }) => {
				if (!remote) {
					const files = this.model.root().elementAt("files") as RealTimeObject;
					files.set(file.path, file);
				}
			}),

			this.actions$.pipe(ofType(FileActions.deleteFile)).subscribe(({ file, remote }) => {
				if (!remote) {
					const files = this.model.root().elementAt("files") as RealTimeObject;
					files.remove(file.path);
				}
			}),

			this.actions$
				.pipe(ofType(FileActions.setSelectedFile))
				.subscribe(({ path, remote }) => {
					if (!remote) {
						this.model
							.root()
							.elementAt("selectedFile")
							.value(path ?? "");
					}
				}),

			this.actions$
				.pipe(ofType(DirectoryActions.addDirectory))
				.subscribe(({ directory, remote }) => {
					if (!remote) {
						const directories = this.model
							.root()
							.elementAt("directories") as RealTimeObject;
						directories.set(directory.path, directory);
					}
				}),

			this.actions$
				.pipe(ofType(DirectoryActions.deleteDirectory))
				.subscribe(({ directory, remote }) => {
					if (!remote) {
						const directories = this.model
							.root()
							.elementAt("directories") as RealTimeObject;
						directories.remove(directory.path);
					}
				}),

			this.model
				.root()
				.get("selectedFile")
				.events()
				.subscribe(e => {
					if (e instanceof ModelChangedEvent && !e.local) {
						const selectedFilePath = this.model.root().get("selectedFile").value();
						const path = selectedFilePath?.length > 1 ? selectedFilePath : null;
						this.store.dispatch(FileActions.setSelectedFile({ path, remote: true }));
					}
				}) as any,

			this.model
				.root()
				.get("files")
				.events()
				.subscribe(e => {
					if (e instanceof ObjectSetEvent && !e.local) {
						this.store.dispatch(
							FileActions.addFile({ file: e.value.value(), remote: true })
						);
					} else if (e instanceof ObjectRemoveEvent && !e.local) {
						this.store.dispatch(
							FileActions.deleteFile({ file: e.oldValue.value(), remote: true })
						);
					}
				}) as any,

			this.model
				.root()
				.get("directories")
				.events()
				.subscribe(e => {
					if (e instanceof ObjectSetEvent && !e.local) {
						this.store.dispatch(
							DirectoryActions.addDirectory({
								directory: e.value.value(),
								remote: true
							})
						);
					} else if (e instanceof ObjectRemoveEvent && !e.local) {
						this.store.dispatch(
							DirectoryActions.deleteDirectory({
								directory: e.oldValue.value(),
								remote: true
							})
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

	getRealTimeTerminalInput(): RealTimeString {
		return this.model.root().elementAt(["terminal", "input"]) as RealTimeString;
	}

	getRealTimeTerminalOutput(): RealTimeObject {
		return this.model.root().elementAt(["terminal", "output"]) as RealTimeObject;
	}

	setTerminalOutput(data: Partial<DataModel["terminal"]["output"]>): void {
		const initial = {
			isRunning: false,
			result: {
				run: {
					stdout: null,
					stderr: null
				},
				compile: {
					stdout: null,
					stderr: null
				}
			}
		};

		const output = { ...initial, ...data };

		this.getRealTimeTerminalOutput().value(output);
	}

	private async connectToConvergence(): Promise<void> {
		const user = await firstValueFrom(this.store.select(StudentMgmtSelectors.user));
		const username = user?.displayName || `User-${nanoid(6)}`;

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
		this.subscriptions = [];
		this.model.removeAllListeners();
		await this.domain?.disconnect();
		this.activeSessionId$.next(null);
		this.collaborators$.next(null);
	}
}
