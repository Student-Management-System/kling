import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { WorkspaceService } from "@web-ide/ide-services";
import { IndexedDbService } from "@web-ide/indexed-db";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap, tap, withLatestFrom } from "rxjs";
import { DirectoryActions } from "../directory-store";
import { FileActions } from "../file-store";
import { FileTabActions } from "../file-tabs-store";
import * as WorkspaceActions from "./workspace.actions";
import { Store } from "@ngrx/store";
import { WorkspaceSelectors } from ".";
import { selectProjectName } from "./workspace.selectors";

@Injectable()
export class WorkspaceEffects {
	loadProject$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(WorkspaceActions.loadProject),
			tap(async action => {
				this.workspace.initWorkspace();
				action.files.forEach(file => {
					this.workspace.emitFileAdded(file);
				});

				const project = await this.indexedDb.projects.getByName(action.projectName);

				if (project) {
					await this.indexedDb.projects.put({ ...project, lastOpened: new Date() });

					this.router.navigate([], {
						queryParams: {
							project: action.projectName
						},
						queryParamsHandling: "merge",
						preserveFragment: true
					});
				} else {
					console.error(`Project "${action.projectName}" does not exist.`);
				}
			}),
			switchMap(action => [
				DirectoryActions.clearDirectories(),
				FileActions.clearFiles(),
				FileTabActions.clearFileTabs(),
				DirectoryActions.addDirectories({ directories: action.directories }),
				FileActions.addFiles({ files: action.files })
			])
		);
	});

	overwriteProject$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(WorkspaceActions.overwriteProject),
			withLatestFrom(this.store.select(selectProjectName)),
			tap(async ([action, projectName]) => {
				this.workspace.initWorkspace();
				action.files.forEach(file => {
					this.workspace.emitFileAdded(file);
				});

				await this.indexedDb.projects.saveProject(
					{
						lastOpened: new Date(),
						name: projectName,
						source: "in-memory"
					},
					action.files
				);
			}),
			switchMap(([action]) => [
				DirectoryActions.clearDirectories(),
				FileActions.clearFiles(),
				FileTabActions.clearFileTabs(),
				DirectoryActions.addDirectories({ directories: action.directories }),
				FileActions.addFiles({ files: action.files })
			])
		);
	});

	constructor(
		private store: Store,
		private actions$: Actions,
		private workspace: WorkspaceService,
		private router: Router,
		private indexedDb: IndexedDbService
	) {}
}
