import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { filter, map, withLatestFrom } from "rxjs/operators";
import { FileTabActions, FileTabSelectors } from ".";
import { FileActions, FileSelectors } from "../file-store";
import { File } from "../file-store/file.model";

@Injectable()
export class FileTabEffects {
	/**
	 * Listens for `FileTabActions.removeFileTab*` and dispatches `FileActions.setSelectedFile_FileTabRemoved`,
	 * if the closed tab was the currently selected file.
	 */
	selectNextTab$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(FileTabActions.removeFileTab, FileTabActions.removeFileTab_FileRemoved),
			withLatestFrom(
				this.store.select(FileSelectors.selectCurrentFile),
				this.store.select(FileTabSelectors.getFileTabs)
			),
			filter(([action, currentFile]) => action.filePath === currentFile.path),
			map(([action, currentFile, tabs]) =>
				FileActions.setSelectedFile_FileTabRemoved({
					fileId: tabs.length > 0 ? tabs[0].path : null
				})
			)
		);
	});

	/**
	 * Listens for `FileActions.setSelectedFile` and dispatches `FileTabActions.addFileTab_FileSelectedEffect`,
	 * if the selected file has no corresponding tab.
	 */
	addTabForSelectedFile$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(FileActions.setSelectedFile, FileActions.setSelectedFile_FileTabRemoved),
			filter(action => !!action.fileId),
			withLatestFrom(this.store.select(FileTabSelectors.getFileTabs)),
			filter(([action, tabs]) => !tabs.find(file => file.path === action.fileId)),
			map(([action]) =>
				FileTabActions.addFileTab_FileSelectedEffect({ filePath: action.fileId })
			)
		);
	});

	/**
	 * Listens for `FileActions.deleteFile` and dispatches `FileTabActions.removeFileTab_FileRemoved`,
	 * if the removed file had a corresponding tab.
	 */
	closeTabOfRemovedFile$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(FileActions.deleteFile),
			withLatestFrom(this.store.select(FileTabSelectors.getFileTabs)),
			filter(([action, tabs]) => this.removedFileHasTab(tabs, action.fileId)),
			map(([action]) => FileTabActions.removeFileTab_FileRemoved({ filePath: action.fileId }))
		);
	});

	constructor(private actions$: Actions, private store: Store) {}

	/**
	 * Returns `true`, if `tabs` contain a file with the specified `path`.
	 */
	private removedFileHasTab(tabs: File[], path: string): boolean {
		return !!tabs.find(file => file.path === path);
	}
}
