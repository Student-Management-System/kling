import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { tap } from "rxjs/operators";
import { UnsubscribeOnDestroy } from "../../../shared/components/unsubscribe-on-destroy.component";
import { AuthActions, AuthSelectors } from "@kling/client/data-access/state";

/**
 * Dialogs that allows the user to login to the Student-Management-System using the Sparkyservice as authentication provider.
 * @returns `True`, if user logged in successfully.
 */
@Component({
	selector: "app-login",
	templateUrl: "./login.dialog.html",
	styleUrls: ["./login.dialog.scss"]
})
export class LoginDialog extends UnsubscribeOnDestroy implements OnInit {
	username: string;
	password: string;
	errorMessage: string;
	loading = false;
	authState$ = this.store.select(AuthSelectors.selectAuthState);

	constructor(
		private dialogRef: MatDialogRef<LoginDialog, boolean>,
		private store: Store,
		private actions: Actions
	) {
		super();
	}

	ngOnInit(): void {
		this.subs.sink = this.actions
			.pipe(
				ofType(AuthActions.loginFailure),
				tap(action => (this.errorMessage = this.getErrorMessage(action.error)))
			)
			.subscribe();

		this.subs.sink = this.actions
			.pipe(
				ofType(AuthActions.loginSuccess),
				tap(() => this.dialogRef.close(true))
			)
			.subscribe();
	}

	onLogin(): void {
		const username = this.username.trim();
		const password = this.password.trim();
		this.store.dispatch(AuthActions.login({ username, password }));
	}

	private getErrorMessage(error: any): string {
		switch (error.status) {
			case 0:
				return "Error.ConnectionRefused";
			case 401:
				return "Error.InvalidCredentials";
			default:
				return "Login failed (Reason: Unknown).";
		}
	}
}
