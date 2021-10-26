import { Directory } from "@kling/programming";
import { createAction, props } from "@ngrx/store";

export const addDirectory = createAction(
	"[Directory/API] Add Directory",
	props<{ directory: Directory; remote?: boolean }>()
);

export const addDirectories = createAction(
	"[Directory/API] Add Directories",
	props<{ directories: Directory[] }>()
);

export const deleteDirectory = createAction(
	"[Directory/API] Delete Directory",
	props<{ directory: Directory; remote?: boolean }>()
);

export const clearDirectories = createAction("[Directory/API] Clear Directories");
