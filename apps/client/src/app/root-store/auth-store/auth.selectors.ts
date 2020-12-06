import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromAuth from "./auth.reducer";

export const selectAuthState = createFeatureSelector<fromAuth.State>(fromAuth.authFeatureKey);

export const selectAuthenticatedUser = createSelector(selectAuthState, state => state.user);

export const selectedAccessToken = createSelector(
	selectAuthState,
	state => state.authToken?.accessToken
);
