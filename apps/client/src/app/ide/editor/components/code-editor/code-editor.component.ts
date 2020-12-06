import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	OnInit,
	Output,
	ViewChild
} from "@angular/core";
import { Store } from "@ngrx/store";
import { EditorComponent } from "ngx-monaco-editor";
import { Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { FileSelectors, WorkspaceSelectors } from "../../../../root-store";
import { File } from "../../../../root-store/file-store/file.model";
import { UnsubscribeOnDestroy } from "../../../../shared/components/unsubscribe-on-destroy.component";
import { ThemeService } from "../../../../shared/services/theme.service";
import { WorkspaceFacade } from "../../../services/workspace.facade";

class EditorModelState {
	textModel: monaco.editor.ITextModel;
	viewState: monaco.editor.ICodeEditorViewState;
}

@Component({
	selector: "app-code-editor",
	templateUrl: "./code-editor.component.html",
	styleUrls: ["./code-editor.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeEditorComponent extends UnsubscribeOnDestroy implements OnInit {
	editorOptions = {
		theme: "vs-dark",
		language: "typescript",
		minimap: {
			enabled: false
		}
	};

	@Output() onEditorInit = new EventEmitter<void>();

	@ViewChild("editor") private editorComponent: EditorComponent;
	private editor: monaco.editor.IStandaloneCodeEditor;
	private editorModelByFileId = new Map<string, EditorModelState>();
	private selectedFilePath: string;
	private isInitialized = false;

	constructor(
		private store: Store,
		private workspace: WorkspaceFacade,
		private theme: ThemeService
	) {
		super();
	}

	ngOnInit(): void {
		this.subs.sink = this.subscribeToTheme();
		this.subs.sink = this.subscribeToFileSelected();
		this.subs.sink = this.subscribeToFileAdded();
		this.subs.sink = this.subscribeToFileRemoved();
		this.subs.sink = this.workspace.init$.subscribe(() => this._disposeAllModels());
	}

	initEditor(event: any): void {
		this.editor = event;
		setTimeout(() => this.resize(), 500);
		this._disposeAllModels(); // Remove automatically created initial model

		if (!this.isInitialized) {
			this.isInitialized = true;
			monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
			this.onEditorInit.emit();
		}
	}

	private subscribeToFileRemoved(): Subscription {
		return this.workspace.fileRemoved$.subscribe(fileId => {
			if (fileId) {
				// Remove from map
				this.editorModelByFileId.delete(fileId);

				// Dispose model
				const model = window?.monaco?.editor?.getModel(this.createFileUri(fileId));
				model.dispose();
			}
		});
	}

	private createFileUri(fileId: string): monaco.Uri {
		return monaco.Uri.parse("file:///" + fileId);
	}

	private subscribeToFileAdded(): Subscription {
		return this.workspace.fileAdded$.subscribe(file => {
			if (file) {
				this.createModel(file);
			}
		});
	}

	private subscribeToFileSelected(): Subscription {
		return this.store
			.select(FileSelectors.selectCurrentFile)
			.pipe(
				tap(file => {
					if (file) {
						this.saveCurrentViewState();
					}
					this.switchToSelectedFile(file);
					this.selectedFilePath = file?.path;
				})
			)
			.subscribe();
	}

	/**
	 * Sets the editor's model to the model associated with the given `file`.
	 * Also restores the view state (i.e scroll position, selections), if it has been saved before.
	 */
	private switchToSelectedFile(file: File) {
		const editorModelState = file ? this.editorModelByFileId.get(file.path) : null;
		if (editorModelState) {
			this.editor?.setModel(editorModelState.textModel);

			if (editorModelState.viewState) {
				this.editor?.restoreViewState(editorModelState.viewState);
			}
		}
	}

	/**
	 * Stores the view state (i.e scroll position, selections) of the currently opened file.
	 */
	private saveCurrentViewState() {
		this.editorModelByFileId.set(this.selectedFilePath, {
			textModel: this.editor.getModel(),
			viewState: this.editor.saveViewState()
		});
	}

	private subscribeToTheme(): Subscription {
		return this.store.select(WorkspaceSelectors.selectTheme).subscribe(theme => {
			console.log(theme);
			switch (theme) {
				case "light":
					monaco.editor.setTheme("vs-light");
					break;
				case "dark":
					monaco.editor.setTheme("vs-dark");
					break;
				default:
					break;
			}
		});
	}

	/**
	 * Returns the current content of a file.
	 */
	getFileContent(fileId: string): string {
		return this.editorModelByFileId.get(fileId).textModel?.getValue();
	}

	format(): void {
		this.editor.getAction("editor.action.formatDocument").run();
	}

	private createModel(file: File): monaco.editor.ITextModel {
		const model = window.monaco.editor.createModel(
			file.content,
			"typescript",
			this.createFileUri(file.path)
		);

		this.editorModelByFileId.set(file.path, {
			textModel: model,
			viewState: null
		});
		return model;
	}

	resize(): void {
		this.editor?.layout();
	}

	ngOnDestroy(): void {
		super.ngOnDestroy();
		this._disposeAllModels();
	}

	private _disposeAllModels() {
		window?.monaco?.editor?.getModels().forEach(model => model.dispose());
		this.editorModelByFileId.clear();
	}
}
