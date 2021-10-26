import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { filter, map, withLatestFrom } from "rxjs/operators";
import { FileTabActions, FileTabSelectors } from ".";
import { FileActions, FileSelectors } from "../file-store";

@Injectable()
export class FileTabEffects {
	/**
	 * Listens for `FileTabActions.removeFileTab*` and dispatches `FileActions.setSelectedFile_FileTabRemoved`,
	 * if the closed tab was the currently selected file.
	 */
	selectNextTab$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(FileTabActions.removeFileTab),
			withLatestFrom(
				this.store.select(FileSelectors.selectSelectedFilePath),
				this.store.select(FileTabSelectors.getFileTabs)
			),
			filter(([action, selectedFilePath]) => action.path === selectedFilePath),
			map(([_action, _currentFile, tabs]) =>
				FileActions.setSelectedFile({
					path: tabs[0] ?? null
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
			ofType(FileActions.setSelectedFile),
			filter(action => !!action.path),
			withLatestFrom(this.store.select(FileTabSelectors.getFileTabs)),
			filter(([action, tabs]) => !tabs.find(path => path === action.path)),
			map(([action]) => FileTabActions.addFileTab({ path: action.path! }))
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
			map(([action]) => FileTabActions.removeFileTab({ path: action.file.path }))
		);
	});

	constructor(private actions$: Actions, private store: Store) {}

	/**
	 * Returns `true`, if `tabs` contain the specified `deletedPath`.
	 */
	private removedFileHasTab(tabs: string[], deletedPath: string): boolean {
		return !!tabs.find(path => path === deletedPath);
	}
}
