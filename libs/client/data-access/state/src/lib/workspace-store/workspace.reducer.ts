import { createReducer, on } from "@ngrx/store";
import * as WorkspaceActions from "./workspace.actions";

export const workspaceFeatureKey = "workspace";

export interface State {
	projectName: string;
	language: string;
	theme: string;
}

function createInitialState(): State {
	const stored = JSON.parse(localStorage.getItem("workspaceSettings"));

	return {
		projectName: "Unnamed Project",
		language: stored?.language ?? "java",
		theme: localStorage.getItem("theme") === "default-theme" ? "light" : "dark"
	};
}

export const reducer = createReducer(
	createInitialState(),
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
