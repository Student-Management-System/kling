import { createAction, props } from "@ngrx/store";
import { File, Directory } from "@web-ide/programming";

export const loadProject = createAction(
	"[Workspace] Load Project",
	props<{
		files: File[];
		directories: Directory[];
		projectName: string;
		entryPoint?: string | null;
	}>()
);

export const overwriteProject = createAction(
	"[Workspace] Overwrite Project",
	props<{
		files: File[];
		directories: Directory[];
	}>()
);

export const createProject = createAction(
	"[Workspace] Save as new project",
	props<{
		projectName?: string;
	}>()
);

export const setEntryPoint = createAction(
	"[File] Mark as entry point",
	props<{ path: string | null }>()
);
