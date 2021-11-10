import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import {
	DirectoryActions,
	DirectorySelectors,
	FileSelectors
} from "@web-ide/client/data-access/state";
import { DialogService } from "@web-ide/client/shared/services";
import { WorkspaceDialogs } from "@web-ide/ide-dialogs";
import { Directory, File } from "@web-ide/programming";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { DragAndDropService } from "../../services/drag-and-drop.service";

@Component({
	selector: "web-ide-directory",
	templateUrl: "./directory.component.html",
	styleUrls: ["./directory.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectoryComponent implements OnInit {
	@Input() dropListIds: string[];

	@Input() directory: Directory;
	/** The file that is currently selected by the user (displayed in the editor). */
	@Input() selectedFilePath: string | null;

	/** Subdirectories of this directory. */
	directories$: Observable<Directory[]>;
	/** Files of this directory. */
	files$: Observable<File[]>;
	/** Indicates, wether subdirectories and files should be expanded or collapsed. */
	isExpanded = true;

	constructor(
		readonly workspaceDialogs: WorkspaceDialogs,
		readonly dragAndDrop: DragAndDropService,
		private store: Store,
		private dialogService: DialogService
	) {}

	ngOnInit(): void {
		this.directories$ = this.store.select(
			DirectorySelectors.selectSubdirectories(this.directory.path)
		);
		this.files$ = this.store.select(FileSelectors.selectFilesOfDirectory(this.directory.path));
	}

	drop(event: CdkDragDrop<File[]>): Promise<void> {
		return this.dragAndDrop.onFileMoved(event);
	}

	removeDirectoryIfConfirmed(): void {
		this.dialogService
			.openConfirmDialog({
				title: "Action.Remove",
				message: "Prompt.Question.AreYouSure",
				params: [this.directory.name]
			})
			.subscribe(confirmed => {
				if (confirmed) {
					this.store.dispatch(
						DirectoryActions.deleteDirectory({ directory: this.directory })
					);
				}
			});
	}

	/**
	 * Toggles the `isExpanded` flag.
	 */
	toggleIsExpanded(): void {
		this.isExpanded = !this.isExpanded;
	}
}
