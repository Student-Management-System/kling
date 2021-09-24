import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
	Directory,
	DirectorySelectors,
	File,
	FileActions,
	FileSelectors,
	WorkspaceActions,
	WorkspaceSelectors
} from "@kling/client/data-access/state";
import { Store } from "@ngrx/store";
import { BehaviorSubject, combineLatest, Subject, take } from "rxjs";
import { ToastService } from "../../shared/services/toast.service";
import { CodeEditorComponent } from "../editor/components/code-editor/code-editor.component";
import { FileSystemAccess } from "./file-system-access.service";
import { IndexedDbService, InMemoryProject, StoredProject } from "./indexed-db.service";

@Injectable({ providedIn: "root" })
export class WorkspaceService {
	private _init$ = new Subject<void>();
	/** Emits when the workspace is initialized. */
	init$ = this._init$.asObservable();

	private _fileAdded$ = new BehaviorSubject<File>(undefined);
	/** Emits the added file. */
	fileAdded$ = this._fileAdded$.asObservable();

	private _fileRemoved$ = new BehaviorSubject<File>(undefined);
	/** Emits the `id` of the removed file. */
	fileRemoved$ = this._fileRemoved$.asObservable();

	/** Emits when the editor should be focused programmatically, i.e. after adding a new file */
	readonly focusEditor$ = new Subject<void>();

	/** Determines the application's entry point. */
	readonly entryPoint$ = this.store.select(WorkspaceSelectors.selectEntryPoint);

	private __editorComponent: CodeEditorComponent;
	private recentProjectKey = "recentProject";
	private stdin: string;

	constructor(
		private readonly router: Router,
		private readonly route: ActivatedRoute,
		private readonly store: Store,
		private readonly fileSystem: FileSystemAccess,
		private readonly indexedDb: IndexedDbService,
		private readonly toast: ToastService
	) {}

	initWorkspace(): void {
		this._init$.next();
	}

	emitFileAdded(file: File): void {
		this._fileAdded$.next(file);
	}

	emitFileRemoved(file: File): void {
		this._fileRemoved$.next(file);
	}

	/** Brings browser focus to the editor. */
	focusEditor(): void {
		this.__editorComponent.focus();
	}

	saveProject(): void {
		combineLatest([
			this.store.select(FileSelectors.selectAllFiles),
			this.store.select(DirectorySelectors.selectAllDirectories),
			this.store.select(WorkspaceSelectors.selectProjectName),
			this.store.select(WorkspaceSelectors.selectEntryPoint)
		])
			.pipe(take(1))
			.subscribe(([files, directories, projectName, entryPoint]) => {
				const copiedFiles = files.map(file => ({
					...file,
					content: this.__editorComponent.getFileContent(file.path)
				}));

				const project = { files: copiedFiles, directories, projectName, entryPoint };

				localStorage.setItem(this.recentProjectKey, JSON.stringify(project));
				this.toast.success("Saved to Localstorage");

				this.router.navigate([], {
					relativeTo: this.route,
					queryParams: {
						project: projectName
					}
				});
			});
	}

	async restoreProject(projectName: string, source: "fs" | "in-memory"): Promise<void> {
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: {
				project: projectName,
				source
			}
		});

		try {
			const project = await this.indexedDb.getProjectByName(projectName);

			switch (project.source) {
				case "fs":
					this.fileSystem._synchronizeWithDirectory(project.directoryHandle);
					break;
				case "in-memory":
					this.restoreInMemoryProject(project);
					break;
				default:
					console.error(
						`Unknown or missing source (${source}). URL query parameter should specify either "fs" or "in-memory".`
					);
					break;
			}
		} catch (error) {
			console.error(`Failed to restore project: ${projectName}`);
			console.error(error);
		}
	}

	private restoreInMemoryProject(project: InMemoryProject) {
		const {
			name,
			project: { files, directories }
		} = project;

		this.store.dispatch(
			WorkspaceActions.loadProject({
				projectName: name,
				files: files ?? [],
				directories: directories ?? []
			})
		);

		this.store.dispatch(FileActions.setSelectedFile({ file: files?.[0] ?? null }));
	}

	/**
	 * Sets the entry point for the currently opened project.
	 * The entry point must be known to create code execution requests.
	 *
	 * @param path
	 */
	setEntryPoint(path: string): void {
		this.store.dispatch(WorkspaceActions.setEntryPoint({ path }));
	}

	/**
	 * Sets the `stdin`, which will be included in code execution requests to enable programs to read
	 * user input from the command line.
	 *
	 * @param content
	 */
	setStdin(content: string): void {
		this.stdin = content;
	}

	getStdin(): string {
		return this.stdin;
	}

	setEditorComponent(component: CodeEditorComponent): void {
		this.__editorComponent = component;
	}
}
