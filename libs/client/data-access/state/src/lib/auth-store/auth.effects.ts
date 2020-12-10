import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY, of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import * as AuthActions from "./auth.actions";

@Injectable()
export class AuthEffects {
	loadAuths$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(AuthActions.requestAuthentication),
			switchMap(() =>
				/** An EMPTY observable only emits completion. Replace with your own observable API request */
				EMPTY.pipe(
					map(authToken => AuthActions.authenticationSuccess({ authToken: authToken })),
					catchError(error => of(AuthActions.authenticationFail({ error })))
				)
			)
		);
	});

	constructor(private actions$: Actions) {}
}
