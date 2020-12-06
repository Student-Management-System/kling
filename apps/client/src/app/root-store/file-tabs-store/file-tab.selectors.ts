import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FileSelectors } from "../file-store";
import * as fromFileTab from "./file-tab.reducer";

export const selectFileTabState = createFeatureSelector<fromFileTab.State>(
	fromFileTab.fileTabFeatureKey
);

export const getFileTabs = createSelector(
	selectFileTabState,
	FileSelectors.selectFileEntities,
	(state, files) => state.tabs.map(filePath => files[filePath])
);
