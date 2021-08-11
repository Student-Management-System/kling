import { createAction, props } from "@ngrx/store";
import { Update } from "@ngrx/entity";

import { File } from "./file.model";

export const addFile = createAction("[Workspace] Add File", props<{ file: File }>());

export const addFiles = createAction("[Workspace] Add Files", props<{ files: File[] }>());

export const addFile_FileExplorer = createAction(
	"[File Explorer] Add File",
	props<{ file: File }>()
);

export const addFile_Directory = createAction("[Directory] Add File", props<{ file: File }>());

export const upsertFile = createAction("[File] Upsert File", props<{ file: File }>());

export const updateFile = createAction("[File] Update File", props<{ file: Update<File> }>());

export const deleteFile = createAction("[File] Delete File", props<{ path: string }>());

export const clearFiles = createAction("[Workspace] Clear Files");

export const setSelectedFile = createAction("[File] Select File", props<{ file: File | null }>());

export const setSelectedFile_FileTabRemoved = createAction(
	"[Effect selectNextTab$] Select File",
	props<{ file: File | null }>()
);
