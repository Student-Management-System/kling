import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import {
	ConfirmDialog,
	ConfirmDialogData
} from "../components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { Observable } from "rxjs";

/**
 * Service that can be used by components to open common dialogs.
 */
@Injectable({ providedIn: "root" })
export class DialogService {
	constructor(private dialog: MatDialog, private translate: TranslateService) {}

	/**
	 * Opens the ConfirmDialog.
	 * @returns true, if user pressed confirm.
	 */
	openConfirmDialog(data?: ConfirmDialogData): Observable<boolean> {
		return this.dialog
			.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, { data })
			.afterClosed();
	}
}
