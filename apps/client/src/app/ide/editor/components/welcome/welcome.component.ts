import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthSelectors, createMainFile, FileActions } from "@kling/client/data-access/state";
import { SupportedLanguage } from "@kling/programming";
import { Store } from "@ngrx/store";
import { environment } from "../../../../../environments/environment";
import { LoginDialog } from "../../../../auth/dialogs/login/login.dialog";
import { AuthService } from "../../../../auth/services/auth.service";
import { WorkspaceService } from "../../../services/workspace.service";
import { FileExplorerDialogs } from "../../../side-bar/file-explorer/services/file-explorer-dialogs.facade";

@Component({
	selector: "app-welcome",
	templateUrl: "./welcome.component.html",
	styleUrls: ["./welcome.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent implements OnInit {
	user$ = this.store.select(AuthSelectors.selectUser);
	recentProjects: string[] = [];

	_isDevelopment = !environment.production;

	constructor(
		readonly dialogs: FileExplorerDialogs,
		private readonly dialog: MatDialog,
		private readonly authService: AuthService,
		private readonly store: Store,
		private readonly workspace: WorkspaceService
	) {}

	ngOnInit(): void {
		const storedProject = localStorage.getItem("recentProject");

		if (storedProject) {
			this.recentProjects = [JSON.parse(storedProject).projectName];
		}
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

	openRecentProject(projectName: string): void {
		this.workspace.restoreProject(projectName);
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
