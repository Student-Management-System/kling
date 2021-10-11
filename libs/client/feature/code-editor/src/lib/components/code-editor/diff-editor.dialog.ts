import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as monaco from "monaco-editor";

export type DiffEditorDialogData = {
	model: monaco.editor.IDiffEditorModel;
	filename: string;
	previousVersionName: string;
};

@Component({
	selector: "app-diff-editor-dialog",
	template: `<div class="diff-dialog">
		<h1>Changes: {{ filename }}</h1>
		<div class="content">
			<span class="text-light">Version: {{ previousVersionName }}</span>
			<div id="diff-editor"></div>
		</div>
	</div>`,
	styleUrls: ["./diff-editor.dialog.scss"]
})
export class DiffEditorDialog implements OnInit, OnDestroy {
	filename!: string;
	diffEditor: monaco.editor.IStandaloneDiffEditor | null = null;
	previousVersionName!: string;

	constructor(
		private dialogRef: MatDialogRef<DiffEditorDialog>,
		@Inject(MAT_DIALOG_DATA) private data: DiffEditorDialogData
	) {}

	ngOnInit(): void {
		this.filename = this.data.filename;
		this.previousVersionName = this.data.previousVersionName;
		this.diffEditor = monaco.editor.createDiffEditor(document.getElementById("diff-editor")!);
		this.diffEditor.setModel({
			original: this.data.model.original,
			modified: this.data.model.modified
		});
	}

	ngOnDestroy(): void {
		this.data.model.original.dispose();
		this.diffEditor?.dispose();
	}
}
