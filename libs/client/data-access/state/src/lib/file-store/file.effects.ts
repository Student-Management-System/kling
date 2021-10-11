import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";
import { WorkspaceService } from "@kling/ide-services";
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
				ofType(FileActions.addFile),
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
				tap(async action => {
					await this.workspace.deleteFile(action.file.path);
					this.workspace.emitFileRemoved(action.file);
				})
			);
		},
		{ dispatch: false }
	);

	fileSelected$ = createEffect(
		() => {
			return this.actions$.pipe(
				ofType(FileActions.setSelectedFile, FileActions.setSelectedFile_FileTabRemoved),
				tap(({ path }) => {
					if (path) {
						this.setFileUrlQueryParameter(path);
					} else {
						this.setFileUrlQueryParameter(undefined);
					}
				})
			);
		},
		{ dispatch: false }
	);

	constructor(
		private actions$: Actions,
		private workspace: WorkspaceService,
		private router: Router
	) {}

	private setFileUrlQueryParameter(path: string | undefined) {
		this.router.navigate([], {
			queryParams: {
				file: path
			},
			queryParamsHandling: "merge"
		});
	}
}
