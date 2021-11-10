import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { WorkspaceService } from "@web-ide/ide-services";
import { IndexedDbService } from "@web-ide/indexed-db";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap, tap } from "rxjs/operators";
import { DirectoryActions } from "../directory-store";
import { FileActions } from "../file-store";
import { FileTabActions } from "../file-tabs-store";
import * as WorkspaceActions from "./workspace.actions";

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

	constructor(
		private actions$: Actions,
		private workspace: WorkspaceService,
		private router: Router,
		private indexedDb: IndexedDbService
	) {}
}
