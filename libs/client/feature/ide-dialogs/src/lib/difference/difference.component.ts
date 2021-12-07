import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Inject,
	NgModule,
	OnDestroy,
	OnInit
} from "@angular/core";
import { MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import { File } from "@web-ide/programming";
import * as monaco from "monaco-editor";

export type DifferenceDialogData = {
	date: Date;
	original: File[];
	modified: File[];
	selectedFile?: string | null;
};

type SelectOption = {
	path: string;
	type: "added" | "removed" | "modified" | undefined;
};

@Component({
	selector: "web-ide-difference",
	templateUrl: "./difference.component.html",
	styleUrls: ["./difference.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DifferenceDialogComponent implements OnInit, OnDestroy {
	diffEditor: monaco.editor.IStandaloneDiffEditor | null = null;
	selectableDiffs: SelectOption[] = [];
	selectedFilePath: string | null = null;

	private diffModels = new Map<string, monaco.editor.IDiffEditorModel>();

	constructor(
		@Inject(MAT_DIALOG_DATA) readonly data: DifferenceDialogData,
		private cdRef: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		const htmlElement = document.getElementById("diff-editor");

		if (!htmlElement) {
			throw new Error("No HTML element with id: diff-editor");
		}

		const { original, modified, selectedFile } = this.data;

		this.diffEditor = monaco.editor.createDiffEditor(htmlElement, {
			readOnly: true
		});

		this.selectableDiffs = this.categorizeChangedFiles(original, modified);

		if (selectedFile) {
			this.selectedFilePath = selectedFile;

			const model = this.diffModels.get(selectedFile);

			if (model) {
				this.diffEditor.setModel(model);
			} else {
				console.error("No model for selected file: " + selectedFile);
			}
		} else {
			const firstOption = this.selectableDiffs[0];

			if (firstOption) {
				const initialModel = this.diffModels.get(firstOption.path);

				if (initialModel) {
					this.diffEditor.setModel(initialModel);
				}
			}
		}

		this.diffEditor.layout();
		this.cdRef.detectChanges();
	}

	change(event: MatSelectChange): void {
		const path = event.value;
		const model = this.diffModels.get(path);

		if (!model) {
			throw new Error("Model does not exist: " + path);
		}

		this.selectedFilePath = path;
		this.diffEditor?.setModel(model);
	}

	private categorizeChangedFiles(original: File[], modified: File[]): SelectOption[] {
		const selectableDiffs: SelectOption[] = [];

		for (const file of original) {
			const existingFile = modified.find(f => f.path === file.path);

			if (existingFile) {
				selectableDiffs.push({
					path: file.path,
					type: file.content !== existingFile.content ? "modified" : undefined
				});

				this.diffModels.set(file.path, {
					original: this.createModel(file, true),
					modified: this.createModel(existingFile, false)
				});
			} else {
				selectableDiffs.push({
					path: file.path,
					type: "removed"
				});

				const emptyFile: File = {
					...file,
					content: ""
				};

				this.diffModels.set(file.path, {
					original: this.createModel(file, true),
					modified: this.createModel(emptyFile, false)
				});
			}
		}

		for (const file of modified) {
			const existingFile = original.find(f => f.path === file.path);

			if (!existingFile) {
				selectableDiffs.push({
					path: file.path,
					type: "added"
				});

				const emptyFile: File = {
					...file,
					content: ""
				};

				this.diffModels.set(file.path, {
					original: this.createModel(emptyFile, true),
					modified: this.createModel(file, false)
				});
			}
		}

		return selectableDiffs;
	}

	private createModel(file: File, isOriginal: boolean): monaco.editor.ITextModel {
		const model = monaco.editor.createModel(
			file.content,
			undefined,
			this.createFileUri(file.path, isOriginal)
		);

		return model;
	}

	private createFileUri(path: string, isOriginal: boolean): monaco.Uri {
		return monaco.Uri.parse("diff:///" + (isOriginal ? "original" : "") + path);
	}

	ngOnDestroy(): void {
		this.diffModels.forEach(v => {
			v.original.dispose();
			v.modified.dispose();
		});

		this.diffEditor?.dispose();
	}
}

@NgModule({
	declarations: [DifferenceDialogComponent],
	exports: [DifferenceDialogComponent],
	imports: [CommonModule, MatDialogModule, MatSelectModule, TranslateModule]
})
export class DifferenceDialogModule {}
