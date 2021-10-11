import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthenticationService } from "@student-mgmt/api";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { AuthenticationInfoDto } from "./auth-info.dto";
import * as AuthActions from "./auth.actions";
import { AuthService } from "@kling/client-auth";
import { ToastService } from "@kling/client-shared";

@Injectable()
export class AuthEffects {
	login$ = createEffect(() =>
		this.actions$.pipe(
			ofType(AuthActions.login),
			switchMap(({ username, password }) =>
				this.http.post(this.authUrl, { username, password }).pipe(
					switchMap((authInfo: AuthenticationInfoDto) => {
						AuthService.setAuthState({ accessToken: authInfo.token.token } as any);
						return this.authApi.whoAmI();
					}),
					map(user => {
						this.toast.success(user.displayName, "Common.Welcome");
						const state = { user, accessToken: AuthService.getAccessToken() };
						AuthService.setAuthState(state);
						return AuthActions.loginSuccess(state);
					}),
					catchError(error => {
						console.log(error);
						return of(AuthActions.loginFailure({ error: error.error }));
					})
				)
			)
		)
	);

	logout$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(AuthActions.logout),
				tap(() => {
					localStorage.removeItem(this.studentMgmtTokenKey);
					this.router.navigateByUrl("courses");
				})
			),
		{ dispatch: false }
	);

	private studentMgmtTokenKey = "studentMgmtToken";

	constructor(
		private actions$: Actions,
		private http: HttpClient,
		private authApi: AuthenticationService,
		private router: Router,
		private toast: ToastService,
		@Inject("SPARKY_AUTHENTICATE_URL") private authUrl: string
	) {}
}
