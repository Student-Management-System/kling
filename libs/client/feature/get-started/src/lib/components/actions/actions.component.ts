import { ChangeDetectionStrategy, Component } from "@angular/core";
import { WorkspaceDialogs } from "@kling/ide-dialogs";
import { FileSystemAccess } from "@kling/ide-services";

@Component({
	selector: "kling-actions",
	templateUrl: "./actions.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionsComponent {
	hasFileSystemAccessSupport = !!window.showDirectoryPicker;

	constructor(
		private readonly dialogs: WorkspaceDialogs,
		private readonly fileSystem: FileSystemAccess
	) {}

	addFile(): void {
		this.dialogs.openCreateFileDialog();
	}

	addFolder(): void {
		this.dialogs.openCreateDirectoryDialog();
	}

	newProject(): void {
		this.dialogs.openCreateProjectDialog();
	}

	importFile(): void {
		this.fileSystem.importFile();
	}

	importFolder(): void {
		this.fileSystem.openDirectory();
	}

	synchronizeFolder(): void {
		this.fileSystem.openDirectoryAndSynchronize();
	}
}
