import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from "@angular/core";
import { connectAnonymously } from "@convergence/convergence";
import { File, FileSelectors, WorkspaceSelectors } from "@kling/client/data-access/state";
import { Store } from "@ngrx/store";
import * as monaco from "monaco-editor";
import "monaco-editor/esm/vs/language/typescript/monaco.contribution.js";
//import { EditorComponent } from "ngx-monaco-editor";
import { fromEvent, Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { UnsubscribeOnDestroy } from "../../../../shared/components/unsubscribe-on-destroy.component";
import { ThemeService } from "../../../../shared/services/theme.service";
import { WorkspaceFacade } from "../../../services/workspace.facade";
import { MonacoConvergenceAdapter } from "./convergence/monaco-adapter";
import { main } from "./src/app";

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
	@Output() onEditorInit = new EventEmitter<void>();

	private editor: monaco.editor.IStandaloneCodeEditor;
	private editorModelByFileId = new Map<string, EditorModelState>();
	private selectedFilePath: string;

	constructor(
		private store: Store,
		private workspace: WorkspaceFacade,
		private theme: ThemeService
	) {
		super();
	}

	async ngOnInit(): Promise<void> {
		this.editor = await main("typescript");

		this.subs.sink = this.subscribeToThemeChanged();
		this.subs.sink = this.subscribeToFileSelected();
		this.subs.sink = this.subscribeToFileAdded();
		this.subs.sink = this.subscribeToFileRemoved();
		this.subs.sink = this.workspace.init$.subscribe(() => this._disposeAllModels());

		this.initEditor();
	}

	initEditor(): void {
		this.subs.sink = fromEvent(window, "resize").subscribe(() => {
			this.resize();
		});

		this._disposeAllModels(); // Remove automatically created initial model

		monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
		// this.editor.addAction({
		// 	id: "RUN_CODE",
		// 	label: "Run Code",
		// 	contextMenuOrder: 1,
		// 	contextMenuGroupId: "Custom",
		// 	keybindings: [monaco.KeyCode.F5],
		// 	run: (editor, ...args) => {
		// 		console.log("RUN_CODE", args);
		// 	}
		// });

		// connectAnonymously(
		// 	"http://localhost:8000/api/realtime/convergence/default",
		// 	"User-" + Math.floor(Math.random() * 1000)
		// )
		// 	.then(d => {
		// 		// Now open the model, creating it using the initial data if it does not exist.
		// 		return d.models().openAutoCreate({
		// 			collection: "example-monaco",
		// 			id: "convergenceExampleId",
		// 			data: {
		// 				text: this.getFileContent(this.selectedFilePath)
		// 			}
		// 		});
		// 	})
		// 	.then(model => {
		// 		const adapter = new MonacoConvergenceAdapter(this.editor, model.elementAt("text"));
		// 		adapter.bind();
		// 	})
		// 	.catch(error => {
		// 		console.error("Could not open model ", error);
		// 	});

		this.onEditorInit.emit();
	}

	private subscribeToFileRemoved(): Subscription {
		return this.workspace.fileRemoved$.subscribe(fileId => {
			if (fileId) {
				// Remove from map
				this.editorModelByFileId.delete(fileId);

				// Dispose model
				const model = monaco?.editor?.getModel(this.createFileUri(fileId));
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

	private subscribeToThemeChanged(): Subscription {
		return this.store.select(WorkspaceSelectors.selectTheme).subscribe(theme => {
			switch (theme) {
				case "light":
					monaco.editor?.setTheme("vs-light");
					break;
				case "dark":
					monaco.editor?.setTheme("vs-dark");
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
		const split = file.path.split(".");
		const language = split[split.length - 1];

		const model = monaco.editor.createModel(
			file.content,
			undefined,
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
		monaco?.editor?.getModels().forEach(model => model.dispose());
		this.editorModelByFileId.clear();
	}
}
