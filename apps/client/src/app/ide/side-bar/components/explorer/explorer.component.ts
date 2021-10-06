import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
	DirectorySelectors,
	FileSelectors,
	WorkspaceSelectors
} from "@kling/client/data-access/state";
import { Store } from "@ngrx/store";
import { firstValueFrom } from "rxjs";
import {
	CreateProjectDialog,
	CreateProjectDialogData
} from "../../../dialogs/create-project/create-project.dialog";
import { FileSystemAccess } from "../../../services/file-system-access.service";
import { FileExplorerDialogs } from "../../file-explorer/services/file-explorer-dialogs.facade";

@Component({
	selector: "app-explorer",
	templateUrl: "./explorer.component.html",
	styleUrls: ["./explorer.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExplorerComponent {
	rootDirectory$ = this.store.select(DirectorySelectors.selectDirectoryByPath(""));
	workspace$ = this.store.select(WorkspaceSelectors.selectWorkspaceState);

	constructor(
		public fileExplorerDialogs: FileExplorerDialogs,
		private readonly fileSystem: FileSystemAccess,
		private readonly store: Store,
		private readonly dialog: MatDialog
	) {}

	exportToDisk(): void {
		this.fileSystem.exportAsZip();
	}

	async saveAsNewProject(): Promise<void> {
		const currentFiles = await firstValueFrom(this.store.select(FileSelectors.selectAllFiles));
		const projectName = await firstValueFrom(
			this.store.select(WorkspaceSelectors.selectProjectName)
		);

		this.dialog.open<CreateProjectDialog, CreateProjectDialogData, void>(CreateProjectDialog, {
			data: {
				project: {
					name: projectName,
					files: currentFiles
				}
			}
		});
	}

	createNewProject(): void {
		this.dialog.open(CreateProjectDialog);
	}
}
