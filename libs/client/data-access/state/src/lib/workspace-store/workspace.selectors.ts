import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromWorkspace from "./workspace.reducer";

export const selectWorkspaceState = createFeatureSelector<fromWorkspace.State>(
	fromWorkspace.workspaceFeatureKey
);

export const selectProjectName = createSelector(selectWorkspaceState, state => state.projectName);

export const selectTheme = createSelector(selectWorkspaceState, state => state.theme);
