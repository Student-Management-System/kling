import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { File, FileActions } from "@kling/client/data-access/state";
import { Store } from "@ngrx/store";
import { DialogService } from "../../../../../shared/services/dialog.service";
import { FileExplorerDialogs } from "../../services/file-explorer-dialogs.facade";

@Component({
	selector: "app-file",
	templateUrl: "./file.component.html",
	styleUrls: ["./file.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileComponent implements OnInit {
	@Input() file: File;
	/** Determines, if this file is marked as selected (being viewed). */
	@Input() isSelected: boolean;

	constructor(
		private store: Store,
		private workspaceDialogs: FileExplorerDialogs,
		private dialogService: DialogService
	) {}

	ngOnInit(): void {}

	/**
	 * Emits that this file has been selected.
	 */
	openFile(): void {
		if (!this.isSelected) {
			this.store.dispatch(FileActions.setSelectedFile({ path: this.file.path }));
		}
	}

	rename(): void {
		this.workspaceDialogs.openRenameDialog(this.file.name).subscribe(newName => {
			console.log("Renaming is not implemented.");
		});
	}

	removeFileIfConfirmed(): void {
		this.dialogService
			.openConfirmDialog({
				title: "Action.Delete",
				message: "Prompt.Question.AreYouSure",
				params: [this.file.name]
			})
			.subscribe(confirmed => {
				if (confirmed) {
					this.store.dispatch(FileActions.deleteFile({ path: this.file.path }));
				}
			});
	}
}
