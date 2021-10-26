import { createReducer, on } from "@ngrx/store";
import * as WorkspaceActions from "./workspace.actions";

export const workspaceFeatureKey = "workspace";

export interface State {
	entryPoint?: string | null;
	projectName: string;
}

function createInitialState(): State {
	return {
		entryPoint: null,
		projectName: "Playground"
	};
}

export const reducer = createReducer(
	createInitialState(),
	on(WorkspaceActions.loadProject, (state, action) => ({
		...state,
		projectName: action.projectName,
		entryPoint: action.entryPoint
	})),
	on(WorkspaceActions.setEntryPoint, (state, action) => ({
		...state,
		entryPoint: action.path
	}))
);
