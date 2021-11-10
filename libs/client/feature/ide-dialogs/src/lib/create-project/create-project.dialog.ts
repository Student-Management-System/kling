import { ChangeDetectionStrategy, Component, Inject, OnInit } from "@angular/core";
import { AsyncValidatorFn, FormControl, ValidatorFn, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FileActions, WorkspaceActions } from "@web-ide/client/data-access/state";
import { IndexedDbService } from "@web-ide/indexed-db";
import {
	createDirectoriesFromFiles,
	File,
	forbiddenCharacters,
	isProjectNameValid
} from "@web-ide/programming";
import { Store } from "@ngrx/store";

export type CreateProjectDialogData = {
	project?: {
		name: string;
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
	selector: "web-ide-create-project",
	templateUrl: "./create-project.dialog.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateProjectDialogComponent implements OnInit {
	projectNameControl = new FormControl(
		"",
		[Validators.required, ProjectNameValidator()],
		[this.projectNameAvailableValidator()]
	);

	/** Name of the project that the new project will be based on. */
	fromProject?: string;

	forbiddenCharactersString = forbiddenCharacters.toString();

	constructor(
		private store: Store,
		private indexedDb: IndexedDbService,
		@Inject(MAT_DIALOG_DATA) private data: CreateProjectDialogData,
		private dialogRef: MatDialogRef<CreateProjectDialogComponent, void>
	) {}

	ngOnInit(): void {
		this.fromProject = this.data?.project?.name;
	}

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
