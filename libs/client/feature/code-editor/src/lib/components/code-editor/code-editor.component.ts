/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	OnDestroy,
	OnInit,
	Output
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { CheckMessageDto } from "@student-mgmt/exercise-submitter-api-client";
import {
	FileActions,
	FileSelectors,
	StudentMgmtSelectors
} from "@web-ide/client/data-access/state";
import { UnsubscribeOnDestroy } from "@web-ide/client/shared/components";
import { ThemeService } from "@web-ide/client/shared/services";
import { CollaborationService } from "@web-ide/collaboration";
import {
	CodeExecutionService,
	WorkspaceService,
	WorkspaceSettingsService
} from "@web-ide/ide-services";
import { File } from "@web-ide/programming";
import * as monaco from "monaco-editor";
import "monaco-editor/esm/vs/language/typescript/monaco.contribution.js";
import { debounceTime, firstValueFrom, fromEvent, merge, Subject, Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { MonacoConvergenceAdapter } from "./convergence/monaco-adapter";
import { DiffEditorDialog, DiffEditorDialogData } from "./diff-editor.dialog";
import { main } from "./src/app";

interface EditorModelState {
	textModel: monaco.editor.ITextModel;
	viewState: monaco.editor.ICodeEditorViewState;
}

@Component({
	selector: "web-ide-code-editor",
	templateUrl: "./code-editor.component.html",
	styleUrls: ["./code-editor.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeEditorComponent extends UnsubscribeOnDestroy implements OnInit, OnDestroy {
	@Output() codeEditorInit = new EventEmitter<void>();
	selectedFilePath: string | null | undefined;

	onFileChanged$ = new Subject<void>();

	private editor!: monaco.editor.IStandaloneCodeEditor;
	private editorModelByPath = new Map<string, EditorModelState>();
	private filesWithUnsavedChanges = new Set<string>();
	private showRulers = true;
	private hasCollaborationSession = false;
	private adapter: MonacoConvergenceAdapter | null = null;

	constructor(
		private readonly store: Store,
		private readonly actions$: Actions,
		private readonly workspace: WorkspaceService,
		private readonly workspaceSettings: WorkspaceSettingsService,
		private readonly themeService: ThemeService,
		private readonly dialog: MatDialog,
		private readonly codeExecution: CodeExecutionService,
		private readonly collaboration: CollaborationService,
		private readonly cdRef: ChangeDetectorRef
	) {
		super();
	}

	async ngOnInit(): Promise<void> {
		const theme = await firstValueFrom(this.themeService.theme$);

		this.editor = await main(theme);

		this.subs.sink = this.codeExecution.onTriggerExecution$.subscribe(() =>
			this.triggerCodeExecutionRequest()
		);

		this.subs.sink = this.subscribeToFileSelected();
		this.subs.sink = this.subscribeToFileAdded();
		this.subs.sink = this.subscribeToFileRemoved();

		this.subs.sink = this.workspace.init$.subscribe(() => {
			this.adapter = null;
			this.selectedFilePath = null;
			this.editorModelByPath.clear();
			this.filesWithUnsavedChanges.clear();
			this._disposeAllModels();
		});

		this.subs.sink = this.store
			.select(FileSelectors.selectPreviouslySelectedFilePath)
			.subscribe(path => {
				if (path && this.filesWithUnsavedChanges.has(path)) {
					this.store.dispatch(
						FileActions.saveFile({
							path,
							content: this.getFileContent(path)!
						})
					);
				}
			});

		this.subs.sink = this.actions$
			.pipe(
				ofType(FileActions.fileSaved),
				tap(action => {
					this.filesWithUnsavedChanges.delete(action.path);
				})
			)
			.subscribe();

		this.subs.sink = this.onFileChanged$.pipe(debounceTime(500)).subscribe(() => {
			this.saveCurrentFile();
		});

		this.subs.sink = this.store
			.select(StudentMgmtSelectors.submissionResult)
			.subscribe(result => {
				this.clearDiagnostics();

				if (result?.messages) {
					this.createDiagnostics(result.messages);
				}
			});

		this.initEditor();
	}

	private createDiagnostics(checkMessage: CheckMessageDto[]) {
		const markersByFile = new Map<string, monaco.editor.IMarkerData[]>();
		checkMessage.forEach(m => {
			if (m.file) {
				const markers = markersByFile.get(m.file) ?? [];
				markers.push({
					message: m.message,
					source: m.checkName,
					startLineNumber: m.line ?? 0,
					endLineNumber: m.line ?? 0,
					severity:
						m.type === "ERROR"
							? monaco.MarkerSeverity.Error
							: monaco.MarkerSeverity.Warning,
					startColumn: m.column ?? 0,
					endColumn: m.column ?? 0
				});
				markersByFile.set(m.file, markers);
			}
		});

		markersByFile.forEach((markers, path) => {
			const model = this.editorModelByPath.get(path);

			if (!model) {
				console.error("No model for: " + path);
				return;
			}

			monaco.editor.setModelMarkers(model.textModel, "editor", markers);
		});
	}

	private clearDiagnostics() {
		this.editorModelByPath.forEach(model =>
			monaco.editor.setModelMarkers(model.textModel, "editor", [])
		);
	}

	private initEditor(): void {
		this.subs.sink = merge(
			fromEvent(window, "resize"),
			this.workspaceSettings.layout$
		).subscribe(() => {
			setTimeout(() => this.resize(), 0); // Hack: Delay resize to prevent race condition
		});

		monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
		monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
			strict: true
		});

		this.editor.onDidChangeModelContent(() => {
			if (!this.filesWithUnsavedChanges.has(this.selectedFilePath!)) {
				this.filesWithUnsavedChanges.add(this.selectedFilePath!);
				this.store.dispatch(FileActions.markAsChanged({ path: this.selectedFilePath! }));
			}

			this.onFileChanged$.next();
		});

		this.registerCustomActions();

		this.subs.sink = this.collaboration.activeSessionId$.subscribe(session => {
			this.hasCollaborationSession = !!session;
		});

		this.codeEditorInit.emit();
	}

	/**
	 * Adds custom actions to the editor that can be accessed through the editor's command palette.
	 */
	private registerCustomActions(): void {
		this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
			this.saveCurrentFile();
		});

		this.editor.addCommand(monaco.KeyCode.F5, () => {
			this.triggerCodeExecutionRequest();
		});

		this.editor.addAction({
			id: "PRINT_DEBUG_INFO",
			label: "[Developer] Print Debug Info",
			contextMenuGroupId: "Custom",
			run: () => {
				console.log({
					editorModelByPath: this.editorModelByPath,
					activeModel: this.editor.getModel(),
					models: monaco.editor.getModels()
				});
			}
		});

		this.editor.addAction({
			id: "RUN_CODE",
			label: "Run Code",
			contextMenuOrder: 1,
			contextMenuGroupId: "Custom",
			run: () => {
				this.triggerCodeExecutionRequest();
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
					modified!.getValue(),
					undefined,
					this.createFileUri(this.selectedFilePath!)
				);

				this.openDiffEditorDialog({
					model: { original, modified: modified! },
					filename: this.selectedFilePath!,
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
				this.setDiagnostics(this.getCurrentModel()!, [
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

	private saveCurrentFile() {
		if (this.selectedFilePath) {
			this.store.dispatch(
				FileActions.saveFile({
					path: this.selectedFilePath,
					content: this.getFileContent(this.selectedFilePath)!
				})
			);
		}
	}

	private async triggerCodeExecutionRequest(): Promise<void> {
		const _entryPoint = await firstValueFrom(this.workspace.entryPoint$);
		const entryPoint = (_entryPoint || this.selectedFilePath) as string;

		if (this.editorModelByPath.has(entryPoint)) {
			const stdin = this.workspace.getStdin();
			const files: { name: string; content: string }[] = [];

			// Main file must be the first file
			files.push({
				name: entryPoint,
				content: this.editorModelByPath.get(entryPoint)!.textModel.getValue()
			});

			this.editorModelByPath.forEach((model, path) => {
				if (path !== entryPoint) {
					files.push({ name: path, content: model.textModel.getValue() });
				}
			});

			await this.codeExecution.execute({ files, stdin });
		}
	}

	/** Returns the model that is currently opened. */
	private getCurrentModel(): monaco.editor.ITextModel | null {
		return this.editorModelByPath.get(this.selectedFilePath!)?.textModel ?? null;
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
		return this.workspace.fileRemoved$.subscribe(file => {
			const { textModel } = this.editorModelByPath.get(file.path) as EditorModelState;
			textModel.dispose();

			this.editorModelByPath.delete(file.path);
			this.filesWithUnsavedChanges.delete(file.path);
		});
	}

	private subscribeToFileAdded(): Subscription {
		return this.workspace.fileAdded$.subscribe(file => {
			this.createModel(file);
		});
	}

	private subscribeToFileSelected(): Subscription {
		return this.store
			.select(FileSelectors.selectSelectedFilePath)
			.pipe(
				tap(path => {
					this.adapter?.dispose();

					if (path) {
						this.saveCurrentViewState();

						if (this.hasCollaborationSession) {
							this.adapter = this.createConvergenceAdapter(path);
						}
					}

					this.switchToSelectedFile(path);
					this.selectedFilePath = path;
					this.cdRef.detectChanges();
				})
			)
			.subscribe();
	}

	private createConvergenceAdapter(path: string): MonacoConvergenceAdapter {
		const textModel = this.editorModelByPath.get(path)?.textModel;
		const realTimeString = this.collaboration.getRealTimeFile(path);

		if (!textModel) {
			throw new Error("No model: " + path);
		}
		if (!realTimeString) {
			throw new Error("No RealTimeString: " + path);
		}

		return new MonacoConvergenceAdapter(this.editor, realTimeString);
	}

	/**
	 * Sets the editor's model to the model associated with the given `file`.
	 * Also restores the view state (i.e scroll position, selections), if it has been saved before.
	 */
	private switchToSelectedFile(path: string | null | undefined) {
		const editorModelState = path ? this.editorModelByPath.get(path) : null;
		if (editorModelState) {
			this.editor.setModel(editorModelState.textModel);

			if (editorModelState.viewState) {
				this.editor.restoreViewState(editorModelState.viewState);
			}

			this.editor.focus();
		}
	}

	/**
	 * Stores the view state (i.e scroll position, selections) of the currently opened file.
	 */
	private saveCurrentViewState() {
		if (this.selectedFilePath) {
			this.editorModelByPath.set(this.selectedFilePath, {
				textModel: this.editor.getModel()!,
				viewState: this.editor.saveViewState()!
			});
		}
	}

	/**
	 * Returns the current content of a file.
	 */
	getFileContent(path: string): string | undefined {
		return this.editorModelByPath.get(path)?.textModel?.getValue();
	}

	format(): void {
		this.editor.getAction("editor.action.formatDocument").run();
	}

	focus(): void {
		this.editor?.focus();
	}

	private createModel(file: File): monaco.editor.ITextModel {
		const model = monaco.editor.createModel(
			file.content,
			undefined,
			this.createFileUri(file.path)
		);

		this.editorModelByPath.set(file.path, {
			textModel: model,
			viewState: null!
		});

		return model;
	}

	private createFileUri(path: string): monaco.Uri {
		return monaco.Uri.parse("file:///" + path);
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
}
