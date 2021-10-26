import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AuthenticationService, UserDto } from "@student-mgmt/api";
import { AuthActions, AuthSelectors } from "@kling/client/data-access/state";

type StoredAuthState = { user: UserDto | null; accessToken: string | null };

@Injectable({ providedIn: "root" })
export class AuthService {
	static readonly studentMgmtTokenKey = "studentMgmtToken";

	user$ = this.store.select(AuthSelectors.selectUser);

	constructor(private authenticationService: AuthenticationService, private store: Store) {}

	/**
	 * Returns the stored AccessToken (JWT), which can be assigned to the Authorization-header
	 * to authenticate the user for requests to the server.
	 */
	static getAccessToken(): string | null {
		const token = localStorage.getItem(AuthService.studentMgmtTokenKey);

		if (!token) return "";

		const authState = JSON.parse(token) as StoredAuthState;
		return authState?.accessToken;
	}

	static setAuthState(state: StoredAuthState): void {
		localStorage.setItem(this.studentMgmtTokenKey, JSON.stringify(state));
	}

	/**
	 * **Only available when API is running in dev environment.**
	 *
	 * Sets the `accessToken` to the given `username` and queries the API to check whether
	 * the given username is a valid test account. If successful, the user is logged in as the
	 * specified user.
	 */
	devLogin(username: string): Observable<UserDto> {
		AuthService.setAuthState({ accessToken: username, user: null });

		return this.authenticationService.whoAmI().pipe(
			tap(user => {
				const state = { user, accessToken: username };
				AuthService.setAuthState(state);
				this.store.dispatch(AuthActions.loginSuccess(state));
			})
		);
	}

	logout(): void {
		this.store.dispatch(AuthActions.logout());
	}

	/**
	 * Checks if user is in possession of an authentication token.
	 * (Attention: Does not guarantee that the token is still valid (i.e could be expired).)
	 */
	isLoggedIn(): boolean {
		return !!localStorage.getItem(AuthService.studentMgmtTokenKey);
	}
}
