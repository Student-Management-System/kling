import { Component, OnInit, ChangeDetectionStrategy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

/**
 * Dialog that allows to insert a name.
 * @params `string` - current name
 * @returns `string` - new name
 */
@Component({
	selector: "web-ide-rename",
	templateUrl: "./rename.dialog.html",
	styleUrls: ["./rename.dialog.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenameDialogComponent implements OnInit {
	newName!: string;

	constructor(
		private dialogRef: MatDialogRef<RenameDialogComponent, string>,
		@Inject(MAT_DIALOG_DATA) private oldName: string
	) {}

	ngOnInit(): void {
		this.newName = this.oldName;
	}

	save(): void {
		this.dialogRef.close(this.newName);
	}

	/** Closes the dialog and returns `undefined` to the calling component/service. */
	close(): void {
		this.dialogRef.close(undefined);
	}
}
