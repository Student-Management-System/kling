import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthSelectors, createMainFile, FileActions } from "@kling/client/data-access/state";
import { SupportedLanguage } from "@kling/programming";
import { Store } from "@ngrx/store";
import { BehaviorSubject, first, from, take } from "rxjs";
import { environment } from "../../../../../environments/environment";
import { LoginDialog } from "../../../../auth/dialogs/login/login.dialog";
import { AuthService } from "../../../../auth/services/auth.service";
import {
	ConfirmDialog,
	ConfirmDialogData
} from "../../../../shared/components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { FileSystemAccess } from "../../../services/file-system-access.service";
import { IndexedDbService, StoredProject } from "../../../services/indexed-db.service";
import { WorkspaceService } from "../../../services/workspace.service";
import { FileExplorerDialogs } from "../../../side-bar/file-explorer/services/file-explorer-dialogs.facade";
import { DialogService } from "../../../../shared/services/dialog.service";

@Component({
	selector: "app-welcome",
	templateUrl: "./welcome.component.html",
	styleUrls: ["./welcome.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent implements OnInit {
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
		from(this.indexedDb.getProjects())
			.pipe(take(1))
			.subscribe(projects => this.recentProjects$.next(projects));
	}

	openLoginDialog(): void {
		this.dialog.open(LoginDialog);
	}

	logout(): void {
		this.authService.logout();
	}

	createMainFile(language: SupportedLanguage): void {
		const file = createMainFile(language);
		this.store.dispatch(FileActions.addFile({ file }));
		this.store.dispatch(FileActions.setSelectedFile({ file }));
	}

	openRecentProject(project: StoredProject): void {
		this.workspace.restoreProject(project.name, project.source);
	}

	removeRecentProject(projectName: string): void {
		this.dialogService
			.openConfirmDialog({ title: "Action.Delete", params: [projectName] })
			.subscribe(async confirmed => {
				if (confirmed) {
					await this.indexedDb.deleteProject(projectName);
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
