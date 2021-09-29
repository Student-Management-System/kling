import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { filter, map, withLatestFrom } from "rxjs/operators";
import { FileTabActions, FileTabSelectors } from ".";
import { File, FileActions, FileSelectors } from "../file-store";

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
			filter(([action, currentFile]) => action.filePath === currentFile?.path),
			map(([_action, _currentFile, tabs]) =>
				FileActions.setSelectedFile_FileTabRemoved({
					file: tabs?.[0] ?? null
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
			filter(action => !!action.file),
			withLatestFrom(this.store.select(FileTabSelectors.getFileTabs)),
			filter(([action, tabs]) => !tabs.find(tab => tab.path === action.file.path)),
			map(([action]) => FileTabActions.addFileTab_FileSelectedEffect({ file: action.file }))
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
			filter(([action, tabs]) => this.removedFileHasTab(tabs, action.file.path)),
			map(([action]) =>
				FileTabActions.removeFileTab_FileRemoved({ filePath: action.file.path })
			)
		);
	});

	fileUpdate$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(FileActions.markAsChanged, FileActions.saveFile),
			concatLatestFrom(action =>
				this.store.select(FileSelectors.selectFileByPath(action.path))
			),
			map(([_action, file]) => FileTabActions.updateFileTab({ file }))
		);
	});

	constructor(private actions$: Actions, private store: Store) {}

	/**
	 * Returns `true`, if `tabs` contain a file with the specified `path`.
	 */
	private removedFileHasTab(tabs: File[], deletedPath: string): boolean {
		return !!tabs.find(tab => tab.path === deletedPath);
	}
}
