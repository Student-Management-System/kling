import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { DirectorySelectors, FileSelectors } from "@kling/client/data-access/state";
import { WorkspaceDialogs } from "@kling/ide-services";
import { Store } from "@ngrx/store";
import { DragAndDropService } from "../../services/drag-and-drop.service";

@Component({
	selector: "app-file-explorer",
	templateUrl: "./file-explorer.component.html",
	styleUrls: ["./file-explorer.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileExplorerComponent implements OnInit {
	/** Top-level directories of this project. */
	directories$ = this.store.select(DirectorySelectors.selectSubdirectories(""));
	/** Top-level files of this project. */
	files$ = this.store.select(FileSelectors.selectFilesOfDirectory(""));
	/** The file that is currently selected by the user (displayed in the editor). */
	selectedFile$ = this.store.select(FileSelectors.selectCurrentFile);

	isHovering = false;

	constructor(
		readonly workspaceDialogs: WorkspaceDialogs,
		readonly dragAndDrop: DragAndDropService,
		private store: Store
	) {}

	ngOnInit(): void {}

	async onDrop(event: DragEvent): Promise<void> {
		event.stopPropagation();
		await this.dragAndDrop.onDrop(event);
	}

	toggleHover(value: boolean): void {
		this.isHovering = value;
	}
}
