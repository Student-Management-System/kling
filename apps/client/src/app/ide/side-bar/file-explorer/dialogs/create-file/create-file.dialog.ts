import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { File } from "../../../../../root-store/file-store/file.model";

/**
 * Dialog that allows the user to enter a filename and possibly some options.
 * Returns the `Partial<File>` that should be created, or `undefined`, if user cancelled.
 * @returns `File` - The file that should be created by the opening component/service.
 */
@Component({
	selector: "app-create-file",
	templateUrl: "./create-file.dialog.html",
	styleUrls: ["./create-file.dialog.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateFileDialog implements OnInit {
	/** Name of the file that should be created. Must include extension (i.e. `MyFile.java`) */
	filename: string;
	errors: string;

	constructor(private dialogRef: MatDialogRef<CreateFileDialog>) {}

	ngOnInit(): void {}

	/** Closes the dialog and returns `undefined` to the calling component/service. */
	close(): void {
		this.dialogRef.close(undefined);
	}

	/** Closes the dialog and returns a `Partial<File>` to the calling component/service.  */
	create(): void {
		const file: Partial<File> = {
			name: this.filename
		};
		this.dialogRef.close(file);
	}
}
