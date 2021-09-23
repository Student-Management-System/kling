import { createAction, props } from "@ngrx/store";
import { Update } from "@ngrx/entity";

import { Directory } from "./directory.model";

export const loadDirectories = createAction(
	"[Directory/API] Load Directories",
	props<{ directories: Directory[] }>()
);

export const addDirectory = createAction(
	"[Directory/API] Add Directory",
	props<{ directory: Directory }>()
);

export const upsertDirectory = createAction(
	"[Directory/API] Upsert Directory",
	props<{ directory: Directory }>()
);

export const addDirectories = createAction(
	"[Directory/API] Add Directories",
	props<{ directories: Directory[] }>()
);

export const upsertDirectories = createAction(
	"[Directory/API] Upsert Directories",
	props<{ directories: Directory[] }>()
);

export const updateDirectory = createAction(
	"[Directory/API] Update Directory",
	props<{ directory: Update<Directory> }>()
);

export const updateDirectories = createAction(
	"[Directory/API] Update Directories",
	props<{ directories: Update<Directory>[] }>()
);

export const deleteDirectory = createAction(
	"[Directory/API] Delete Directory",
	props<{ directory: Directory }>()
);

export const deleteDirectories = createAction(
	"[Directory/API] Delete Directories",
	props<{ ids: string[] }>()
);

export const clearDirectories = createAction("[Directory/API] Clear Directories");
