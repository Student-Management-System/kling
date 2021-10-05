import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromWorkspace from "./workspace.reducer";

export const selectWorkspaceState = createFeatureSelector<fromWorkspace.State>(
	fromWorkspace.workspaceFeatureKey
);

export const selectEntryPoint = createSelector(selectWorkspaceState, state => state.entryPoint);

export const selectProjectName = createSelector(selectWorkspaceState, state => state.projectName);
