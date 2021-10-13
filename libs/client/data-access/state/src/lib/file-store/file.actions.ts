import { createAction, props } from "@ngrx/store";
import { File } from "@kling/programming";

export const addFile = createAction("[Workspace] Add File", props<{ file: File }>());

export const addFiles = createAction("[Workspace] Add Files", props<{ files: File[] }>());

export const markAsChanged = createAction("[Editor] Mark as changed", props<{ path: string }>());

export const saveFile = createAction(
	"[Editor] Save File",
	props<{ path: string; content: string }>()
);

export const fileSaved = createAction(
	"[Editor] File saved",
	props<{ path: string; content: string }>()
);

export const deleteFile = createAction("[File] Delete File", props<{ file: File }>());

export const clearFiles = createAction("[Workspace] Clear Files");

export const setSelectedFile = createAction("[File] Select File", props<{ path: string | null }>());

export const setSelectedFile_FileTabRemoved = createAction(
	"[Effect selectNextTab$] Select File",
	props<{ path: string | null }>()
);
