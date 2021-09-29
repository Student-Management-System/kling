import { createAction, props } from "@ngrx/store";
import { File } from "../file-store";

export const addFileTab = createAction("[File Explorer] Add FileTab", props<{ file: File }>());

export const addFileTab_FileSelectedEffect = createAction(
	"[Effect addTabForSelectedFile$] Add FileTab",
	props<{ file: File }>()
);

export const updateFileTab = createAction("[fileUpdate$] Update FileTab", props<{ file: File }>());

export const removeFileTab = createAction(
	"[FileTab] Remove FileTab",
	props<{ filePath: string }>()
);

export const removeFileTab_FileRemoved = createAction(
	"[File Explorer] Remove FileTab",
	props<{ filePath: string }>()
);

export const clearFileTabs = createAction("[Workspace] Clear FileTabs");
