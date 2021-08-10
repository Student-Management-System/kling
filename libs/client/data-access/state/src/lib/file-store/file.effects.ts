import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";
import { WorkspaceFacade } from "../../../../../../../apps/client/src/app/ide/services/workspace.facade";
import * as FileActions from "./file.actions";

@Injectable()
export class FileEffects {
	/**
	 * Listens for `FileActions.addFile*` and calls `WorkspaceFacade.emitFileAdded`
	 * with the added file.
	 * Does not dispatch any action.
	 */
	fileAdded$ = createEffect(
		() => {
			return this.actions$.pipe(
				ofType(
					FileActions.addFile,
					FileActions.addFile_FileExplorer,
					FileActions.addFile_Directory
				),
				tap(action => {
					this.workspace.emitFileAdded(action.file);
				})
			);
		},
		{ dispatch: false }
	);

	/**
	 * Listens for `FileActions.deleteFile` and calls `WorkspaceFacade.emitFileRemoved`
	 * with the removed file.
	 * Does not dispatch any action.
	 */
	fileRemoved$ = createEffect(
		() => {
			return this.actions$.pipe(
				ofType(FileActions.deleteFile),
				tap(({ path }) => this.workspace.emitFileRemoved(path))
			);
		},
		{ dispatch: false }
	);

	constructor(private actions$: Actions, private workspace: WorkspaceFacade) {}
}
