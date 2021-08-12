import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	OnInit,
	Output
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { File, FileSelectors, WorkspaceSelectors } from "@kling/client/data-access/state";
import { Store } from "@ngrx/store";
import * as monaco from "monaco-editor";
import "monaco-editor/esm/vs/language/typescript/monaco.contribution.js";
//import { EditorComponent } from "ngx-monaco-editor";
import { fromEvent, Subscription } from "rxjs";
import { take, tap } from "rxjs/operators";
import { UnsubscribeOnDestroy } from "../../../../shared/components/unsubscribe-on-destroy.component";
import { CodeExecutionService, ExecuteRequest } from "../../../services/code-execution.service";
import { WorkspaceService } from "../../../services/workspace.service";
import { DiffEditorDialog, DiffEditorDialogData } from "./diff-editor.dialog";
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
	selectedFilePath: string;

	private editor: monaco.editor.IStandaloneCodeEditor;
	private editorModelByPath = new Map<string, EditorModelState>();
	private showRulers = true;

	constructor(
		private readonly store: Store,
		private readonly workspace: WorkspaceService,
		private readonly dialog: MatDialog,
		private readonly codeExecution: CodeExecutionService,
		private readonly cdRef: ChangeDetectorRef
	) {
		super();
	}

	async ngOnInit(): Promise<void> {
		this.store
			.select(WorkspaceSelectors.selectWorkspaceState)
			.pipe(take(1))
			.subscribe(async state => {
				const theme = state.theme ?? "dark";

				this.editor = await main(theme);

				this.subs.sink = this.subscribeToThemeChanged();
				this.subs.sink = this.subscribeToFileSelected();
				this.subs.sink = this.subscribeToFileAdded();
				this.subs.sink = this.subscribeToFileRemoved();
				this.subs.sink = this.workspace.init$.subscribe(() => this._disposeAllModels());

				this.initEditor();
			});
	}

	private initEditor(): void {
		this.subs.sink = fromEvent(window, "resize").subscribe(() => {
			this.resize();
		});

		this._disposeAllModels(); // Remove automatically created initial model

		monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

		this.registerCustomActions();

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

	/**
	 * Adds custom actions to the editor that can be accessed through the editor's command palette.
	 */
	private registerCustomActions(): void {
		this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
			console.log("[TODO] Save...");
		});

		this.editor.addAction({
			id: "RUN_CODE",
			label: "Run Code",
			contextMenuOrder: 1,
			contextMenuGroupId: "Custom",
			run: () => {
				const language = this.getLanguageOfFile(this.selectedFilePath);
				const version = this.getLanguageVersion(language);

				console.log(
					`Running ${language} (${version}) code with "${this.selectedFilePath}" as entry point.`
				);

				this.store
					.select(FileSelectors.selectAllFiles)
					.pipe(take(1))
					.subscribe(files => {
						const request: ExecuteRequest = {
							language,
							version,
							files: files.map(file => ({
								name: file.path,
								content: this.getFileContent(file.path)
							}))
						};

						this.codeExecution.execute(request).subscribe({
							next: result => {
								console.log(result);
							},
							error: error => {
								console.log(error);
							}
						});
					});
			}
		});

		this.editor.addAction({
			id: "GET_RUNTIMES",
			label: "Get Runtimes",
			contextMenuOrder: 5,
			contextMenuGroupId: "Custom",
			run: () => {
				this.codeExecution.getRuntimes().subscribe({
					next: result => {
						console.log(result);
					},
					error: error => {
						console.log(error);
					}
				});
			}
		});

		this.editor.addAction({
			id: "VIEW_DIFFERENCE",
			label: "View Difference",
			contextMenuOrder: 2,
			contextMenuGroupId: "Custom",
			run: () => {
				const modified = this.getCurrentModel();
				const original = monaco.editor.createModel(
					modified.getValue(),
					this.getLanguageOfFile(this.selectedFilePath)
				);

				this.openDiffEditorDialog({
					model: { original, modified },
					filename: this.selectedFilePath,
					previousVersionName: new Date().toLocaleString("de")
				});
			}
		});

		this.editor.addAction({
			id: "SET_DIAGNOSTICS",
			label: "Set Diagnostics",
			contextMenuOrder: 3,
			contextMenuGroupId: "Custom",
			run: () => {
				this.setDiagnostics(this.getCurrentModel(), [
					{
						message: "Custom message",
						startLineNumber: 1,
						startColumn: 0,
						endLineNumber: 2,
						endColumn: 5,
						severity: monaco.MarkerSeverity.Warning
					}
				]);
			}
		});

		this.editor.addAction({
			id: "TOGGLE_RULER",
			label: "Toggle Ruler (80 characters)",
			contextMenuOrder: 6,
			contextMenuGroupId: "Custom",
			run: editor => {
				this.showRulers = !this.showRulers;
				editor.updateOptions({
					rulers: this.showRulers ? [80] : []
				});
			}
		});
	}

	/**
	 * Looks up the file extension of the given path and returns the corresponding language.
	 * - `.py` -> `python`
	 * - `.ts` -> `typescript`
	 */
	private getLanguageOfFile(path: string) {
		const split = path.split(".");
		return this.getLanguageId(split[split.length - 1]);
	}

	/** Returns the model that is currently opened. */
	private getCurrentModel(): monaco.editor.ITextModel {
		return this.editorModelByPath.get(this.selectedFilePath).textModel;
	}

	private setDiagnostics(model: monaco.editor.ITextModel, markers: monaco.editor.IMarkerData[]) {
		monaco.editor.setModelMarkers(model, "???", markers);
	}

	private openDiffEditorDialog(data: DiffEditorDialogData): void {
		this.dialog.open<DiffEditorDialog, DiffEditorDialogData, undefined>(DiffEditorDialog, {
			data
		});
	}

	private subscribeToFileRemoved(): Subscription {
		return this.workspace.fileRemoved$.subscribe(path => {
			if (path) {
				// Remove from map
				this.editorModelByPath.delete(path);

				// Dispose model
				const model = monaco?.editor?.getModel(this.createFileUri(path));
				model.dispose();
			}
		});
	}

	private createFileUri(path: string): monaco.Uri {
		return monaco.Uri.parse("file:///" + path);
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
					this.cdRef.detectChanges();
				})
			)
			.subscribe();
	}

	/**
	 * Sets the editor's model to the model associated with the given `file`.
	 * Also restores the view state (i.e scroll position, selections), if it has been saved before.
	 */
	private switchToSelectedFile(file: File) {
		const editorModelState = file ? this.editorModelByPath.get(file.path) : null;
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
		this.editorModelByPath.set(this.selectedFilePath, {
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
	getFileContent(path: string): string {
		return this.editorModelByPath.get(path).textModel?.getValue();
	}

	format(): void {
		this.editor.getAction("editor.action.formatDocument").run();
	}

	private createModel(file: File): monaco.editor.ITextModel {
		const model = monaco.editor.createModel(
			file.content,
			undefined,
			this.createFileUri(file.path)
		);

		this.editorModelByPath.set(file.path, {
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
		this.editorModelByPath.clear();
	}

	private getLanguageId(extension: string): string {
		switch (extension) {
			case "ts":
				return "typescript";
			case "py":
				return "python";
			default:
				return extension;
		}
	}

	private getLanguageVersion(language: string): string {
		switch (language) {
			case "java":
				return "15.0.2";
			case "python":
				return "3.9.4";
			case "typescript":
				return "4.2.3";
			default:
				throw new Error("Unknown language");
		}
	}
}
