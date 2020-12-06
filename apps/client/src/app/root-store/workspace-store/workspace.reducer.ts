import { createReducer, on } from "@ngrx/store";
import * as WorkspaceActions from "./workspace.actions";

export const workspaceFeatureKey = "workspace";

export interface State {
	projectName: string;
	language: string;
	theme: string;
}

export const initialState: State = {
	projectName: null,
	language: "typescript",
	theme: "dark"
};

export const reducer = createReducer(
	initialState,
	on(WorkspaceActions.initEmptyProject, state => state),
	on(WorkspaceActions.loadProject, (state, action) => ({
		...state,
		projectName: action.projectName,
		language: action.language
	})),
	on(WorkspaceActions.setLanguage, (state, action) => ({ ...state, language: action.language })),
	on(WorkspaceActions.setProjectName, (state, action) => ({
		...state,
		projectName: action.name
	})),
	on(WorkspaceActions.setTheme, (state, action) => ({ ...state, theme: action.theme }))
);
