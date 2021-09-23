import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import {
	Directory,
	DirectoryActions,
	DirectorySelectors,
	File,
	FileSelectors
} from "@kling/client/data-access/state";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { DialogService } from "../../../../../shared/services/dialog.service";
import { FileExplorerDialogs } from "../../services/file-explorer-dialogs.facade";

@Component({
	selector: "app-directory",
	templateUrl: "./directory.component.html",
	styleUrls: ["./directory.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectoryComponent implements OnInit {
	@Input() directory: Directory;
	/** The file that is currently selected by the user (displayed in the editor). */
	@Input() selectedFile: File | null;

	/** Subdirectories of this directory. */
	directories$: Observable<Directory[]>;
	/** Files of this directory. */
	files$: Observable<File[]>;
	/** Indicates, wether subdirectories and files should be expanded or collapsed. */
	isExpanded = true;

	constructor(
		public workspaceDialogs: FileExplorerDialogs,
		private store: Store,
		private dialogService: DialogService
	) {}

	ngOnInit(): void {
		this.directories$ = this.store.select(
			DirectorySelectors.selectSubdirectories(this.directory.path)
		);
		this.files$ = this.store.select(FileSelectors.selectFilesOfDirectory(this.directory.path));
	}

	rename(): void {
		this.workspaceDialogs.openRenameDialog(this.directory.name).subscribe(newName => {
			console.log("Renaming is not implemented.");
		});
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
