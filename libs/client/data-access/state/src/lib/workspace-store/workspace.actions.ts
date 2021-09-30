import { createAction, props } from "@ngrx/store";
import { Directory } from "../../../../../../shared/util/programming/src/lib/directory.model";
import { File } from "@kling/programming";

export const loadProject = createAction(
	"[Workspace] Load Project",
	props<{
		files: File[];
		directories: Directory[];
		entryPoint?: string;
		projectName?: string;
	}>()
);

export const setEntryPoint = createAction("[File] Mark as entry point", props<{ path: string }>());

export const setProjectName = createAction(
	"[Workspace] Set Project name",
	props<{ name: string }>()
);

export const setTheme = createAction(
	"[Workspace Settings] Set Theme",
	props<{ theme: "dark" | "light" }>()
);
