import { createAction, props } from "@ngrx/store";
import { Directory } from "../directory-store/directory.model";
import { File } from "../file-store/file.model";

export const loadProject = createAction(
	"[Workspace] Load Project",
	props<{
		files: File[];
		directories: Directory[];
		projectName?: string;
	}>()
);

export const initEmptyProject = createAction("[Workspace] Init empty Project");

export const setProjectName = createAction(
	"[Workspace] Set Project name",
	props<{ name: string }>()
);

export const setTheme = createAction(
	"[Workspace Settings] Set Theme",
	props<{ theme: "dark" | "light" }>()
);
