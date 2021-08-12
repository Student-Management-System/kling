import { createReducer, on } from "@ngrx/store";
import * as WorkspaceActions from "./workspace.actions";

export const workspaceFeatureKey = "workspace";

export interface State {
	projectName: string;
	theme: string;
}

function createInitialState(): State {
	return {
		projectName: "Unnamed Project",
		theme: localStorage.getItem("theme") === "default-theme" ? "light" : "dark"
	};
}

export const reducer = createReducer(
	createInitialState(),
	on(WorkspaceActions.initEmptyProject, state => state),
	on(WorkspaceActions.loadProject, (state, action) => ({
		...state,
		projectName: action.projectName
	})),
	on(WorkspaceActions.setProjectName, (state, action) => ({
		...state,
		projectName: action.name
	})),
	on(WorkspaceActions.setTheme, (state, action) => ({ ...state, theme: action.theme }))
);
