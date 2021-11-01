import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DirectorySelectors, FileActions, WorkspaceActions } from "@kling/client/data-access/state";
import { DialogService } from "@kling/client/shared/services";
import { WorkspaceDialogs } from "@kling/ide-dialogs";
import { File } from "@kling/programming";
import { Store } from "@ngrx/store";
import { tap } from "rxjs";

@Component({
	selector: "kling-file",
	templateUrl: "./file.component.html",
	styleUrls: ["./file.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileComponent {
	@Input() file: File;
	/** Determines, if this file is marked as selected (being viewed). */
	@Input() isSelected: boolean;

	directories$ = this.store.select(DirectorySelectors.selectAllDirectories).pipe(
		tap({
			next: result => {
				console.log(result);
			},
			error: error => {
				console.log(error);
			},
			complete: () => {
				console.log("unsub");
			}
		})
	);

	constructor(
		private store: Store,
		private workspaceDialogs: WorkspaceDialogs,
		private dialogService: DialogService
	) {}

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

	moveTo(): void {
		//
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
