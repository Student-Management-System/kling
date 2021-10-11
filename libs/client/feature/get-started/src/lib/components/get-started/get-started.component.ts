import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "@kling/client-auth";
import { DialogService } from "@kling/client-shared";
import { AuthSelectors, FileActions } from "@kling/client/data-access/state";
import { FileExplorerDialogs, FileSystemAccess, WorkspaceService } from "@kling/ide-services";
import { IndexedDbService, StoredProject } from "@kling/indexed-db";
import { createMainFile, SupportedLanguage } from "@kling/programming";
import { Store } from "@ngrx/store";
import { environment } from "apps/client/src/environments/environment";
import { LoginDialogComponent } from "libs/client/feature/auth/src/lib/dialogs/login/login.dialog";
import { BehaviorSubject, from, take } from "rxjs";

@Component({
	selector: "kling-get-started",
	templateUrl: "./get-started.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GetStartedComponent implements OnInit {
	user$ = this.store.select(AuthSelectors.selectUser);
	recentProjects$ = new BehaviorSubject<StoredProject[]>([]);

	_isDevelopment = !environment.production;

	constructor(
		readonly dialogs: FileExplorerDialogs,
		readonly fileSystem: FileSystemAccess,
		private readonly indexedDb: IndexedDbService,
		private readonly dialog: MatDialog,
		private readonly dialogService: DialogService,
		private readonly authService: AuthService,
		private readonly store: Store,
		private readonly workspace: WorkspaceService
	) {}

	ngOnInit(): void {
		this.loadRecentProjects();
	}

	private loadRecentProjects() {
		from(this.indexedDb.projects.getMany())
			.pipe(take(1))
			.subscribe(projects => this.recentProjects$.next(projects));
	}

	openLoginDialog(): void {
		this.dialog.open(LoginDialogComponent);
	}

	logout(): void {
		this.authService.logout();
	}

	createMainFile(language: SupportedLanguage): void {
		const file = createMainFile(language);
		this.store.dispatch(FileActions.addFile({ file }));
		this.store.dispatch(FileActions.setSelectedFile({ path: file.path }));
	}

	openRecentProject(project: StoredProject): void {
		this.workspace.restoreProject(project.name);
	}

	removeRecentProject(projectName: string): void {
		this.dialogService
			.openConfirmDialog({ title: "Action.Delete", params: [projectName] })
			.subscribe(async confirmed => {
				if (confirmed) {
					await this.indexedDb.projects.delete(projectName);
					this.loadRecentProjects();
				}
			});
	}

	_devLogin(username: string): void {
		this.authService.devLogin(username).subscribe({
			next: user => {
				console.log("Logged in as: " + user);
			},
			error: error => {
				console.log(error);
			}
		});
	}
}
