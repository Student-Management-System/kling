import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { tap } from "rxjs/operators";
import { DirectorySelectors } from ".";
import { FileActions, FileSelectors } from "../file-store";
import * as DirectoryActions from "./directory.actions";

@Injectable()
export class DirectoryEffects {
	/**
	 * Listens for `FileActions.addFile*` and calls `WorkspaceFacade.emitFileAdded`
	 * with the added file.
	 * Does not dispatch any action.
	 */
	directoryRemoved$ = createEffect(
		() => {
			return this.actions$.pipe(
				ofType(DirectoryActions.deleteDirectory),
				concatLatestFrom(({ directory }) => [
					this.store.select(FileSelectors.selectFilesOfDirectory(directory.path)),
					this.store.select(DirectorySelectors.selectSubdirectories(directory.path))
				]),
				tap(([_action, files, subdirectories]) => {
					files.forEach(file => {
						this.store.dispatch(FileActions.deleteFile({ file }));
					});
					subdirectories.forEach(directory => {
						this.store.dispatch(DirectoryActions.deleteDirectory({ directory }));
					});
				})
			);
		},
		{ dispatch: false }
	);

	constructor(private store: Store, private actions$: Actions) {}
}
