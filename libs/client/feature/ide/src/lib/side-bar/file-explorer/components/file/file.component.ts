import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { DialogService } from "@kling/client-shared";
import { FileActions, WorkspaceActions } from "@kling/client/data-access/state";
import { WorkspaceDialogs } from "@kling/ide-dialogs";
import { File } from "@kling/programming";
import { Store } from "@ngrx/store";

@Component({
	selector: "kling-file",
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
		private workspaceDialogs: WorkspaceDialogs,
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

	markAsEntryPoint(): void {
		this.store.dispatch(WorkspaceActions.setEntryPoint({ path: this.file.path }));
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
					this.store.dispatch(FileActions.deleteFile({ file: this.file }));
				}
			});
	}
}
