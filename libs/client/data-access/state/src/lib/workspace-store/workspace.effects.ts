import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { switchMap, tap, withLatestFrom } from "rxjs/operators";
import { WorkspaceSelectors } from ".";
import { WorkspaceService } from "../../../../../../../apps/client/src/app/ide/services/workspace.service";
import { DirectoryActions } from "../directory-store";
import { FileActions } from "../file-store";
import { FileTabActions } from "../file-tabs-store";
import * as WorkspaceActions from "./workspace.actions";

@Injectable()
export class WorkspaceEffects {
	initEmptyProject$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(WorkspaceActions.initEmptyProject),
			tap(() => this.workspace.initWorkspace()),
			switchMap(() => [
				DirectoryActions.clearDirectories(),
				FileActions.clearFiles(),
				FileTabActions.clearFileTabs()
			])
		);
	});

	loadProject$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(WorkspaceActions.loadProject),
			tap(action => {
				action.files.forEach(file => {
					this.workspace.emitFileAdded(file);
				});
			}),
			switchMap(action => [
				DirectoryActions.addDirectories({ directories: action.directories }),
				FileActions.addFiles({ files: action.files })
			])
		);
	});

	onSettingsChanged$ = createEffect(
		() => {
			return this.actions$.pipe(
				ofType(WorkspaceActions.setTheme),
				withLatestFrom(this.store.select(WorkspaceSelectors.selectWorkspaceState)),
				tap(([_, state]) => {
					localStorage.setItem(
						"workspaceSettings",
						JSON.stringify({
							theme: state.theme
						})
					);
				})
			);
		},
		{ dispatch: false }
	);

	constructor(
		private actions$: Actions,
		private workspace: WorkspaceService,
		private store: Store
	) {}
}
