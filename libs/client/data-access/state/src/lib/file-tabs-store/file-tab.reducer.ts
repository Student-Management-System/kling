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
	on(FileTabActions.addFileTab, (state, action) => _addFileTab(state, action)),
	on(FileTabActions.removeFileTab, (state, action) => _removeFileTab(state, action)),
	on(
		FileTabActions.clearFileTabs,
		(): State => ({
			tabs: []
		})
	)
);

function _removeFileTab(state: State, action: { path: string }): State {
	return {
		...state,
		tabs: state.tabs.filter(path => path !== action.path)
	};
}

function _addFileTab(state: State, action: { path: string }): State {
	return { tabs: [...state.tabs, action.path] };
}
