import { createAction, props } from "@ngrx/store";
import { File, Directory } from "@kling/programming";

export const loadProject = createAction(
	"[Workspace] Load Project",
	props<{
		files: File[];
		directories: Directory[];
		entryPoint?: string;
		projectName?: string;
	}>()
);

export const createProject = createAction(
	"[Workspace] Save as new project",
	props<{
		projectName?: string;
	}>()
);

export const setEntryPoint = createAction("[File] Mark as entry point", props<{ path: string }>());
