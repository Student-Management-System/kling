import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromFile from "./file.reducer";

const selectFileState = createFeatureSelector<fromFile.State>(fromFile.filesFeatureKey);

export const selectAllFiles = createSelector(selectFileState, fromFile.selectAll);

export const selectFileEntities = createSelector(selectFileState, fromFile.selectEntities);

export const selectCurrentFile = createSelector(
	selectFileState,
	state => state.entities[state.selectedFileId]
);

export const selectFileByPath = (path: string) =>
	createSelector(selectFileEntities, entities => entities[path]);

export const selectFilesOfDirectory = (directoryPath: string) =>
	createSelector(selectAllFiles, files =>
		files.filter(file => file.directoryPath === directoryPath)
	);
