import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap, withLatestFrom } from "rxjs/operators";
import { WorkspaceService } from "@web-ide/ide-services";
import * as FileActions from "./file.actions";
import { Store } from "@ngrx/store";
import { WorkspaceActions, WorkspaceSelectors } from "../workspace-store";

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
					this.store.dispatch(
						FileActions.saveFile({
							path: action.file.path,
							content: action.file.content
						})
					);
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
				withLatestFrom(this.store.select(WorkspaceSelectors.selectEntryPoint)),
				tap(async ([action, entryPoint]) => {
					this.workspace.emitFileRemoved(action.file);
					await this.workspace.deleteFile(action.file.path);

					if (action.file.path === entryPoint) {
						this.store.dispatch(WorkspaceActions.setEntryPoint({ path: null }));
					}
				})
			);
		},
		{ dispatch: false }
	);

	fileSelected$ = createEffect(
		() => {
			return this.actions$.pipe(
				ofType(FileActions.setSelectedFile),
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

	saveFile$ = createEffect(
		() => {
			return this.actions$.pipe(
				ofType(FileActions.saveFile),
				tap(async ({ path, content }) => {
					await this.workspace.saveFile(path, content);
				})
			);
		},
		{ dispatch: false }
	);

	constructor(
		private store: Store,
		private actions$: Actions,
		private workspace: WorkspaceService,
		private router: Router
	) {}

	private setFileUrlQueryParameter(path: string | undefined) {
		this.router.navigate([], {
			queryParams: {
				file: path
			},
			queryParamsHandling: "merge",
			preserveFragment: true
		});
	}
}
