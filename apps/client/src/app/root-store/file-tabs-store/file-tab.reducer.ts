import { createReducer, on } from "@ngrx/store";
import * as FileTabActions from "./file-tab.actions";

export const fileTabFeatureKey = "fileTab";

export interface State {
	/** List of file paths. */
	tabs: string[];
}

export const initialState: State = {
	tabs: []
};

export const reducer = createReducer(
	initialState,
	on(FileTabActions.addFileTab, FileTabActions.addFileTab_FileSelectedEffect, (state, action) =>
		_addFileTab(state, action)
	),
	on(FileTabActions.removeFileTab, FileTabActions.removeFileTab_FileRemoved, (state, action) =>
		_removeFileTab(state, action)
	),
	on(
		FileTabActions.clearFileTabs,
		(state): State => ({
			...state,
			tabs: []
		})
	)
);

function _removeFileTab(state: State, action: { filePath: string }): State {
	return {
		...state,
		tabs: state.tabs.filter(filePath => filePath !== action.filePath)
	};
}

function _addFileTab(state: State, action: { filePath: string }): State {
	return {
		...state,
		tabs: [...state.tabs, action.filePath]
	};
}
