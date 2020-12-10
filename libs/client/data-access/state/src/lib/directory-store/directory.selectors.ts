import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromDirectory from "./directory.reducer";

export const selectDirectoryState = createFeatureSelector<fromDirectory.State>(
	fromDirectory.directoriesFeatureKey
);

export const selectAllDirectories = createSelector(selectDirectoryState, fromDirectory.selectAll);

export const selectSubdirectories = (path: string) =>
	createSelector(selectAllDirectories, directories =>
		directories.filter(dir => dir.parentDirectoryPath === path)
	);

export const selectDirectoryByPath = (path: string) =>
	createSelector(selectDirectoryState, state => state.entities[path]);
