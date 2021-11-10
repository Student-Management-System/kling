import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmDialog, ConfirmDialogData } from "@web-ide/client/shared/components";
import { Observable } from "rxjs";
import { LoginDialogComponent } from "@web-ide/client-auth";

/**
 * Service that can be used by components to open common dialogs.
 */
@Injectable({ providedIn: "root" })
export class DialogService {
	constructor(private dialog: MatDialog, private translate: TranslateService) {}

	openLoginDialog(): void {
		this.dialog.open(LoginDialogComponent);
	}

	/**
	 * Opens the ConfirmDialog.
	 * @returns true, if user pressed confirm.
	 */
	openConfirmDialog(data?: ConfirmDialogData): Observable<boolean | undefined> {
		return this.dialog
			.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, { data })
			.afterClosed();
	}
}
