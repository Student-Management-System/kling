import { Injectable } from "@angular/core";
import {
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

@Injectable({ providedIn: "root" })
export class WorkspaceService {
	private _init$ = new Subject<void>();
	/** Emits when the workspace is initialized. */
	init$ = this._init$.asObservable();

	private _fileAdded$ = new BehaviorSubject<File>(undefined);
	/** Emits the added file. */
	fileAdded$ = this._fileAdded$.asObservable();

	private _fileRemoved$ = new BehaviorSubject<string>(undefined);
	/** Emits the `id` of the removed file. */
	fileRemoved$ = this._fileRemoved$.asObservable();

	/** Emits when the editor should be focused programmatically, i.e. after adding a new file */
	readonly focusEditor$ = new Subject<void>();

	private __editorComponent: CodeEditorComponent;
	private recentProjectKey = "recentProject";

	constructor(private readonly store: Store, private readonly toast: ToastService) {}

	initWorkspace(): void {
		this._init$.next();
	}

	emitFileAdded(file: File): void {
		this._fileAdded$.next(file);
	}

	emitFileRemoved(path: string): void {
		this._fileRemoved$.next(path);
	}

	/** Brings browser focus to the editor. */
	focusEditor(): void {
		this.__editorComponent.focus();
	}

	saveProject(): void {
		combineLatest([
			this.store.select(FileSelectors.selectAllFiles),
			this.store.select(DirectorySelectors.selectAllDirectories),
			this.store.select(WorkspaceSelectors.selectProjectName)
		])
			.pipe(take(1))
			.subscribe(([files, directories, projectName]) => {
				const copiedFiles = files.map(file => ({
					...file,
					content: this.__editorComponent.getFileContent(file.path)
				}));

				const project = { files: copiedFiles, directories, projectName };

				localStorage.setItem(this.recentProjectKey, JSON.stringify(project));
				this.toast.success("Saved to Localstorage");
			});
	}

	restoreProject(projectName: string): void {
		const storedProject = localStorage.getItem(this.recentProjectKey);

		const project = storedProject
			? JSON.parse(storedProject)
			: { files: [], directories: [], projectName: "Playground" };

		this.store.dispatch(WorkspaceActions.loadProject(project));
		if (project.files?.length > 0) {
			this.store.dispatch(FileActions.setSelectedFile({ file: project.files[0] }));
		}
	}

	setEditorComponent(component: CodeEditorComponent): void {
		this.__editorComponent = component;
	}
}
