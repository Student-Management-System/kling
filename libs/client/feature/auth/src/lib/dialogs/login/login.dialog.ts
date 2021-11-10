import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { AuthenticationInfoDto, AuthService } from "@web-ide/client-auth";
import { StudentMgmtActions } from "@web-ide/client/data-access/state";
import { UnsubscribeOnDestroy } from "@web-ide/client/shared/components";
import { ToastService } from "@web-ide/client/shared/services";
import { Store } from "@ngrx/store";
import { AuthenticationApi } from "@student-mgmt/api-client";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import { switchMap } from "rxjs/operators";

/**
 * Dialogs that allows the user to login to the Student-Management-System using the Sparkyservice as authentication provider.
 * @returns `True`, if user logged in successfully.
 */
@Component({
	selector: "web-ide-login",
	templateUrl: "./login.dialog.html"
})
export class LoginDialogComponent extends UnsubscribeOnDestroy {
	loginState$ = new BehaviorSubject<{ isLoading: boolean; error?: string }>({ isLoading: false });

	constructor(
		private dialogRef: MatDialogRef<LoginDialogComponent, boolean>,
		private store: Store,
		private http: HttpClient,
		private authApi: AuthenticationApi,
		private toast: ToastService,
		@Inject("SPARKY_AUTHENTICATE_URL") private authUrl: string
	) {
		super();
	}

	async onLogin(username: string, password: string): Promise<void> {
		const isLoading = (await firstValueFrom(this.loginState$)).isLoading;

		if (isLoading) {
			return;
		}

		const credentials = {
			username: username.trim(),
			password: password.trim()
		};

		this.loginState$.next({ isLoading: true });

		try {
			let accessToken = "";

			const user = await firstValueFrom(
				this.http.post<AuthenticationInfoDto>(this.authUrl, credentials).pipe(
					switchMap(authInfo => {
						accessToken = authInfo.token.token;
						AuthService.setAuthState({ accessToken, user: null });
						return this.authApi.whoAmI();
					})
				)
			);

			this.loginState$.next({ isLoading: false });
			this.toast.success(user.displayName, "Common.Welcome");

			AuthService.setAuthState({ user, accessToken });
			this.store.dispatch(StudentMgmtActions.setUser({ user }));

			this.dialogRef.close(true);
		} catch (error) {
			console.log(error);

			if (error instanceof HttpErrorResponse) {
				this.loginState$.next({ isLoading: false, error: this.getErrorMessage(error) });
			}
		}
	}

	private getErrorMessage(error: HttpErrorResponse): string {
		switch (error.status) {
			case 0:
				return "Error.ConnectionRefused";
			case 401:
				return "Error.InvalidCredentials";
			default:
				return "Error.SomethingWentWrong";
		}
	}
}
