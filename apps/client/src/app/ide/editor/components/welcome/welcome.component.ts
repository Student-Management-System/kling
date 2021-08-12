import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { AuthSelectors, createMainFile, FileActions } from "@kling/client/data-access/state";
import { SupportedLanguage } from "@kling/programming";
import { Store } from "@ngrx/store";
import { WorkspaceService } from "../../../services/workspace.service";
import { FileExplorerDialogs } from "../../../side-bar/file-explorer/services/file-explorer-dialogs.facade";

@Component({
	selector: "app-welcome",
	templateUrl: "./welcome.component.html",
	styleUrls: ["./welcome.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent implements OnInit {
	user$ = this.store.select(AuthSelectors.selectAuthenticatedUser);

	recentProjects: string[] = [];

	constructor(
		readonly dialogs: FileExplorerDialogs,
		private store: Store,
		private readonly workspace: WorkspaceService
	) {}

	ngOnInit(): void {
		const storedProject = localStorage.getItem("recentProject");

		if (storedProject) {
			this.recentProjects = [JSON.parse(storedProject).projectName];
		}
	}

	createMainFile(language: SupportedLanguage): void {
		const file = createMainFile(language);
		this.store.dispatch(FileActions.addFile({ file }));
		this.store.dispatch(FileActions.setSelectedFile({ file }));
	}

	openRecentProject(projectName: string): void {
		this.workspace.restoreProject(projectName);
	}
}
