import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthenticationService } from "@student-mgmt/api";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { AuthService } from "../../../../../../../apps/client/src/app/auth/services/auth.service";
import { ToastService } from "../../../../../../../apps/client/src/app/shared/services/toast.service";
import { AuthenticationInfoDto } from "./auth-info.dto";
import * as AuthActions from "./auth.actions";

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

	setCourses$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(AuthActions.setCourses),
				tap(action => {
					const user = AuthService.getUser();
					const accessToken = AuthService.getAccessToken();

					user.courses = action.courses;

					localStorage.setItem(
						this.studentMgmtTokenKey,
						JSON.stringify({
							user,
							accessToken
						})
					);
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
