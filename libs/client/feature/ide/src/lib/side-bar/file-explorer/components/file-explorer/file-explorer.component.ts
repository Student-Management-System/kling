import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DirectorySelectors, FileSelectors } from "@kling/client/data-access/state";
import { WorkspaceDialogs } from "@kling/ide-dialogs";
import { File } from "@kling/programming";
import { Store } from "@ngrx/store";
import { DragAndDropService } from "../../services/drag-and-drop.service";

@Component({
	selector: "kling-file-explorer",
	templateUrl: "./file-explorer.component.html",
	styleUrls: ["./file-explorer.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileExplorerComponent {
	/** Top-level directories of this project. */
	directories$ = this.store.select(DirectorySelectors.selectSubdirectories(""));
	/** Top-level files of this project. */
	files$ = this.store.select(FileSelectors.selectFilesOfDirectory(""));
	/** The file that is currently selected by the user (displayed in the editor). */
	selectedFilePath$ = this.store.select(FileSelectors.selectSelectedFilePath);

	isHovering = false;

	constructor(
		readonly workspaceDialogs: WorkspaceDialogs,
		readonly dragAndDrop: DragAndDropService,
		private readonly store: Store
	) {}

	drop(event: CdkDragDrop<File[]>): Promise<void> {
		return this.dragAndDrop.onFileMoved(event);
	}

	async onDrop(event: DragEvent): Promise<void> {
		event.stopPropagation();
		await this.dragAndDrop.onDrop(event);
	}

	toggleHover(value: boolean): void {
		this.isHovering = value;
	}
}
