import { createReducer, on } from "@ngrx/store";
import { File } from "../file-store";
import * as FileTabActions from "./file-tab.actions";

export const fileTabFeatureKey = "fileTab";

export interface State {
	/** List of file paths. */
	tabs: File[];
}

export const initialState: State = {
	tabs: []
};

export const reducer = createReducer(
	initialState,
	on(FileTabActions.addFileTab, FileTabActions.addFileTab_FileSelectedEffect, (state, action) =>
		_addFileTab(state, action.file)
	),
	on(FileTabActions.updateFileTab, (state, action) => {
		const index = state.tabs.findIndex(tab => tab.path === action.file.path);
		const newTabs = [...state.tabs];
		newTabs[index] = action.file;
		return { tabs: newTabs };
	}),
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
		tabs: state.tabs.filter(tab => tab.path !== action.filePath)
	};
}

function _addFileTab(state: State, file: File): State {
	return {
		...state,
		tabs: [
			...state.tabs,
			{
				name: file.name,
				path: file.path,
				directoryPath: file.directoryPath,
				hasUnsavedChanges: file.hasUnsavedChanges,
				content: undefined // Not required here
			}
		]
	};
}
