import { Injectable } from "@angular/core";
import {
	MatSnackBar,
	MatSnackBarRef,
	SimpleSnackBar,
	MatSnackBarConfig
} from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";

/**
 * Service that can be used by components to open a snackbar.
 * Only one snackbar may be displayed at a time.
 * Given messages will be translated by this service, if they match a translation key.
 */
@Injectable({ providedIn: "root" })
export class SnackbarService {
	constructor(private snackbar: MatSnackBar, private translate: TranslateService) {}

	/**
	 * Opens a success-themed snackbar and returns its reference.
	 * @param [message] Custom string or translation key.
	 */
	openSuccessMessage(
		message?: string,
		config?: MatSnackBarConfig
	): MatSnackBarRef<SimpleSnackBar> {
		const translation = message
			? this.translate.instant(message)
			: this.translate.instant("Message.Success");
		return this.snackbar.open(translation, "OK", {
			...{ duration: 2500, panelClass: ["snackbar-success"] }, // Default config
			...config // Overwritten config
		});
	}

	/**
	 * Opens a error-themed snackbar and returns its reference.
	 * @param [message] Custom string or translation key.
	 */
	openErrorMessage(message?: string, config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
		const translation = message
			? this.translate.instant(message)
			: this.translate.instant("Error.SomethingWentWrong");
		return this.snackbar.open(translation, "OK", {
			...{ duration: 2500, panelClass: ["snackbar-error"] }, // Default config
			...config // Overwritten config
		});
	}
}
