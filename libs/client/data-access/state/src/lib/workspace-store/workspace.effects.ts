import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { IndexedDbService } from "@kling/indexed-db";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { switchMap, tap } from "rxjs/operators";
import { WorkspaceService } from "../../../../../../../apps/client/src/app/ide/services/workspace.service";
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

					this.router.navigate(["/ide"], {
						queryParams: {
							project: action.projectName
						}
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
		private indexedDb: IndexedDbService,
		private store: Store
	) {}
}
