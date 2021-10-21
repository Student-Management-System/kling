import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromFile from "./file.reducer";

const selectFileState = createFeatureSelector<fromFile.State>(fromFile.filesFeatureKey);

export const selectAllFiles = createSelector(selectFileState, fromFile.selectAll);

export const selectFileEntities = createSelector(selectFileState, fromFile.selectEntities);

export const selectSelectedFilePath = createSelector(
	selectFileState,
	state => state.selectedFilePath
);

export const selectPreviouslySelectedFilePath = createSelector(
	selectFileState,
	state => state.previouslySelectedFilePath
);

export const selectFileByPath = (path: string) =>
	createSelector(selectFileEntities, entities => entities[path]);

export const selectFilesOfDirectory = (directoryPath: string) =>
	createSelector(selectAllFiles, files =>
		files.filter(file => file.directoryPath === directoryPath)
	);
