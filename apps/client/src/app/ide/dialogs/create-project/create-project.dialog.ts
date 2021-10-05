import { ChangeDetectionStrategy, Component, Inject, OnInit } from "@angular/core";
import { AsyncValidatorFn, FormControl, ValidatorFn, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FileActions, WorkspaceActions } from "@kling/client/data-access/state";
import { IndexedDbService } from "@kling/indexed-db";
import {
	createDirectoriesFromFiles,
	File,
	forbiddenCharacters,
	isProjectNameValid
} from "@kling/programming";
import { Store } from "@ngrx/store";

export type CreateProjectDialogData = {
	project?: {
		files: File[];
	};
};

export function ProjectNameValidator(): ValidatorFn {
	return control => {
		const result = isProjectNameValid((control.value as string).trim());
		return result.valid ? null : { [result.reason]: true };
	};
}

@Component({
	selector: "kling-create-project",
	templateUrl: "./create-project.dialog.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateProjectDialog implements OnInit {
	projectNameControl = new FormControl(
		"",
		[Validators.required, ProjectNameValidator()],
		[this.projectNameAvailableValidator()]
	);

	forbiddenCharactersString = forbiddenCharacters.toString();

	constructor(
		private store: Store,
		private indexedDb: IndexedDbService,
		@Inject(MAT_DIALOG_DATA) private data: CreateProjectDialogData,
		private dialogRef: MatDialogRef<CreateProjectDialog, void>
	) {}

	ngOnInit(): void {}

	async onCreate(projectName: string): Promise<void> {
		if (this.projectNameControl.invalid) {
			throw new Error(`Project name ${projectName} is invalid.`);
		}

		const files = this.data?.project?.files ?? [];
		const directories = createDirectoriesFromFiles(files);

		await this.indexedDb.projects.saveProject(
			{
				name: projectName,
				lastOpened: new Date(),
				source: "in-memory"
			},
			files
		);

		this.store.dispatch(
			WorkspaceActions.loadProject({
				projectName: projectName.trim(),
				files,
				directories
			})
		);

		if (files[0]) {
			this.store.dispatch(FileActions.setSelectedFile({ path: files[0].path }));
		}

		this.dialogRef.close();
	}

	private projectNameAvailableValidator(): AsyncValidatorFn {
		return async control => {
			const isAvailable = await this.isProjectNameAvailable(control.value.trim());
			return isAvailable ? null : { "Error.AlreadyExists": true };
		};
	}

	private async isProjectNameAvailable(projectName: string): Promise<boolean> {
		const project = await this.indexedDb.projects.getByName(projectName);
		return !project;
	}
}
