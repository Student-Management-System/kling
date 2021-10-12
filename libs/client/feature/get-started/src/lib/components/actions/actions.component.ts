import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { FileExplorerDialogs, FileSystemAccess } from "@kling/ide-services";

@Component({
	selector: "kling-actions",
	templateUrl: "./actions.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionsComponent {
	hasFileSystemAccessSupport = !!window.showDirectoryPicker;

	constructor(
		private readonly dialogs: FileExplorerDialogs,
		private readonly fileSystem: FileSystemAccess,
		private readonly matDialog: MatDialog
	) {}

	addFile(): void {
		this.dialogs.openCreateFileDialog();
	}

	addFolder(): void {
		this.dialogs.openCreateDirectoryDialog();
	}

	newProject(): void {
		//this.matDialog.open(CreateProjectDialog);
	}

	importFile(): void {
		this.fileSystem.openFile();
	}

	importFolder(): void {
		this.fileSystem.openDirectory();
	}

	synchronizeFolder(): void {
		this.fileSystem.openDirectoryAndSynchronize();
	}
}
