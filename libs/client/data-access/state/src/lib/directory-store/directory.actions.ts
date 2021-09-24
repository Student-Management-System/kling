import { createAction, props } from "@ngrx/store";
import { Update } from "@ngrx/entity";

import { Directory } from "./directory.model";

export const addDirectory = createAction(
	"[Directory/API] Add Directory",
	props<{ directory: Directory }>()
);

export const addDirectories = createAction(
	"[Directory/API] Add Directories",
	props<{ directories: Directory[] }>()
);

export const updateDirectory = createAction(
	"[Directory/API] Update Directory",
	props<{ directory: Update<Directory> }>()
);

export const deleteDirectory = createAction(
	"[Directory/API] Delete Directory",
	props<{ directory: Directory }>()
);

export const clearDirectories = createAction("[Directory/API] Clear Directories");
