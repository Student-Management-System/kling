import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromFileTab from "./file-tab.reducer";

export const selectFileTabState = createFeatureSelector<fromFileTab.State>(
	fromFileTab.fileTabFeatureKey
);

export const getFileTabs = createSelector(selectFileTabState, state => state.tabs);
