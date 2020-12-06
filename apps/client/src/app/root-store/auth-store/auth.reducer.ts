import { Action, createReducer, on } from "@ngrx/store";
import { UserDto } from "@kling/shared/data-access/api-rest-ng-client";
import * as AuthActions from "./auth.actions";

export const authFeatureKey = "auth";

export interface State {
	authToken: any;
	user: UserDto;
	loading: boolean;
}

export const initialState: State = {
	authToken: null,
	user: null,
	loading: false
};

export const reducer = createReducer(
	initialState,
	on(AuthActions.requestAuthentication, state => ({
		...state,
		loading: true
	})),
	on(AuthActions.authenticationSuccess, (state, { authToken }) => ({
		...state,
		authToken,
		loading: false
	})),
	on(AuthActions.authenticationFail, (state, { error }) => ({
		...state,
		loading: false
	}))
);
