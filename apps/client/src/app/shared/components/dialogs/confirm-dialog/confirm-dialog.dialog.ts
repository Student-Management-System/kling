import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";

export class ConfirmDialogData {
	/**
	 * ALlows overwriting the dialog's default title.
	 */
	title?: string;
	/**
	 * Allows overwriting the dialog's default message.
	 */
	message?: string;
	/**
	 * Information that can be displayed after the message (i.e name of the entity that will be changed if user confirms).
	 */
	params?: string[];
}

@Component({
	selector: "app-confirm-dialog",
	templateUrl: "./confirm-dialog.dialog.html",
	styleUrls: ["./confirm-dialog.dialog.scss"]
})
export class ConfirmDialog implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<ConfirmDialog, boolean>,
		@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
	) {}

	ngOnInit(): void {}

	onCancel(): void {
		this.dialogRef.close(false);
	}

	onConfirm(): void {
		this.dialogRef.close(true);
	}

	getTitle(): string {
		return this.data?.title ?? "Action.Confirm";
	}

	getMessage(): string {
		return this.data?.message ?? "Prompt.Question.AreYouSure";
	}
}
