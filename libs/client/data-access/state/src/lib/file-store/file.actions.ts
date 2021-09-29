import { createAction, props } from "@ngrx/store";
import { File } from "./file.model";

export const addFile = createAction("[Workspace] Add File", props<{ file: File }>());

export const addFiles = createAction("[Workspace] Add Files", props<{ files: File[] }>());

export const markAsChanged = createAction("[Editor] Mark as changed", props<{ path: string }>());

export const saveFile = createAction(
	"[Editor] Save file",
	props<{ path: string; content: string }>()
);

export const deleteFile = createAction("[File] Delete File", props<{ file: File }>());

export const clearFiles = createAction("[Workspace] Clear Files");

export const setSelectedFile = createAction("[File] Select File", props<{ file: File | null }>());

export const setSelectedFile_FileTabRemoved = createAction(
	"[Effect selectNextTab$] Select File",
	props<{ file: File | null }>()
);
