import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { DialogService } from "@kling/client-shared";
import {
	DirectoryActions,
	DirectorySelectors,
	FileSelectors
} from "@kling/client/data-access/state";
import { FileExplorerDialogs } from "@kling/ide-services";
import { Directory, File } from "@kling/programming";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

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
