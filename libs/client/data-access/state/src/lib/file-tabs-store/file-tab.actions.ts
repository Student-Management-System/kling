import { createAction, props } from "@ngrx/store";

export const addFileTab = createAction("[File Explorer] Add FileTab", props<{ path: string }>());

export const addFileTab_FileSelectedEffect = createAction(
	"[Effect addTabForSelectedFile$] Add FileTab",
	props<{ path: string }>()
);

export const removeFileTab = createAction("[FileTab] Remove FileTab", props<{ path: string }>());

export const removeFileTab_FileRemoved = createAction(
	"[File Explorer] Remove FileTab",
	props<{ path: string }>()
);

export const clearFileTabs = createAction("[Workspace] Clear FileTabs");
