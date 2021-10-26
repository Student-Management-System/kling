import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { tap } from "rxjs/operators";
import { AuthActions, AuthSelectors } from "@kling/client/data-access/state";
import { UnsubscribeOnDestroy } from "@kling/client/shared/components";

/**
 * Dialogs that allows the user to login to the Student-Management-System using the Sparkyservice as authentication provider.
 * @returns `True`, if user logged in successfully.
 */
@Component({
	selector: "kling-login",
	templateUrl: "./login.dialog.html",
	styleUrls: ["./login.dialog.scss"]
})
export class LoginDialogComponent extends UnsubscribeOnDestroy implements OnInit {
	errorMessage?: string;
	loading = false;
	authState$ = this.store.select(AuthSelectors.selectAuthState);

	constructor(
		private dialogRef: MatDialogRef<LoginDialogComponent, boolean>,
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

	onLogin(username: string, password: string): void {
		this.store.dispatch(
			AuthActions.login({
				username: username.trim(),
				password: password.trim()
			})
		);
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
