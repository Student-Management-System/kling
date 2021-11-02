import { createReducer, on } from "@ngrx/store";
import { UserDto } from "@student-mgmt/api-client";
import { MetaState } from "../interfaces";
import * as AuthActions from "./auth.actions";

export const authFeatureKey = "auth";

export interface State extends MetaState {
	accessToken: string | null;
	user: UserDto | null;
}

export const initialState: State = {
	accessToken: null,
	user: null,
	hasLoaded: false,
	isLoading: false
};

function createInitialState(): State {
	const initial = initialState;
	const authState = JSON.parse(localStorage.getItem("studentMgmtToken")!) as {
		user: UserDto;
		accessToken: string;
	};

	if (authState) {
		initialState.user = authState.user;
		initial.accessToken = authState.accessToken;
	}

	return initial;
}

export const reducer = createReducer(
	createInitialState(),

	on(
		AuthActions.login,
		(state): State => ({
			...state,
			isLoading: true,
			hasLoaded: false,
			error: undefined
		})
	),
	on(
		AuthActions.loginSuccess,
		(_state, action): State => ({
			accessToken: action.accessToken,
			user: action.user,
			isLoading: false,
			hasLoaded: true
		})
	),
	on(
		AuthActions.loginFailure,
		(state, action): State => ({
			...state,
			isLoading: false,
			hasLoaded: true,
			error: action.error
		})
	),
	on(
		AuthActions.logout,
		(_state): State => ({
			accessToken: null,
			user: null,
			isLoading: false,
			hasLoaded: false,
			error: undefined
		})
	)
);
