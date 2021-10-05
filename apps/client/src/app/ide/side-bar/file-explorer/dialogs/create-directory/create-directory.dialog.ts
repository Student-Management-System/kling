import { ChangeDetectionStrategy, Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subject } from "rxjs";

export class CreateDirectoryDialogData {
	directoryPath: string;
}

/**
 * Dialog that allows the user to insert the name of a new directory.
 * @returns `string` - name of the new directory.
 */
@Component({
	selector: "app-create-directory",
	templateUrl: "./create-directory.dialog.html",
	styleUrls: ["./create-directory.dialog.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateDirectoryDialog implements OnInit {
	name = "";
	error$ = new Subject<string | undefined>();

	constructor(
		private dialogRef: MatDialogRef<CreateDirectoryDialog, string>,
		@Inject(MAT_DIALOG_DATA) private data: CreateDirectoryDialogData
	) {}

	ngOnInit(): void {}

	close(): void {
		this.dialogRef.close();
	}

	/**
	 * Validates the chosen directory name and publishes an appropriate error message (translation key)
	 * via `error$`, if invalid.
	 * Directory name should:
	 * - not be empty
	 * - not exist already in the passed in directory (`data.directory`)
	 */
	validate(): boolean {
		if (this.name.length == 0) {
			this.error$.next("Error.ValueMissing");
			return false;
		}

		// if (this.data.directory.directories.find(dir => dir.name === this.name)) {
		// 	console.log("Already exists");
		// 	this.error$.next("Error.AlreadyExists");
		// 	return false;
		// }

		this.error$.next(undefined);
		return true;
	}

	create(): void {
		if (this.validate()) {
			this.dialogRef.close(this.name);
		}
	}
}
