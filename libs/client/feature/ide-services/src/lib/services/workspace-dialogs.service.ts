import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DirectoryActions, DirectoryState, FileActions } from "@kling/client/data-access/state";
import { createDirectory, createFile } from "@kling/programming";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import {
	CreateDirectoryDialog,
	CreateDirectoryDialogData
} from "../../../../../../../apps/client/src/app/ide/side-bar/file-explorer/dialogs/create-directory/create-directory.dialog";
import { CreateFileDialog } from "../../../../../../../apps/client/src/app/ide/side-bar/file-explorer/dialogs/create-file/create-file.dialog";
import { RenameDialog } from "../../../../../../../apps/client/src/app/ide/side-bar/file-explorer/dialogs/rename/rename.dialog";

/**
 * Facade for dialogs that are used in the workspace.
 */
@Injectable({ providedIn: "root" })
export class WorkspaceDialogs {
	constructor(private dialog: MatDialog, private store: Store<DirectoryState>) {}

	/**
	 * Opens the `CreateFileDialog` and adds a new file to the workspace,
	 * if confirmed by the user.
	 */
	openCreateFileDialog(directoryPath = ""): void {
		this.dialog
			.open<CreateFileDialog, any, Partial<File>>(CreateFileDialog)
			.afterClosed()
			.subscribe(partialFile => {
				if (partialFile?.name && partialFile?.name?.length > 0) {
					const file = createFile(partialFile.name, directoryPath);

					this.store.dispatch(FileActions.addFile({ file }));
					this.store.dispatch(FileActions.setSelectedFile({ path: file.path }));
				}
			});
	}

	/**
	 * Opens the `CreateDirectoryDialog` and adds a new directory to the workspace,
	 * if confirmed by the user.
	 * If `directoryPath` was specified, the directory is added as a subdirectory.
	 */
	openCreateDirectoryDialog(directoryPath = ""): void {
		const data: CreateDirectoryDialogData = { directoryPath };
		this.dialog
			.open<CreateDirectoryDialog, CreateDirectoryDialogData, string>(CreateDirectoryDialog, {
				data
			})
			.afterClosed()
			.subscribe(directoryName => {
				if (directoryName) {
					if (directoryName.length > 0) {
						this.store.dispatch(
							DirectoryActions.addDirectory({
								directory: createDirectory(directoryName, directoryPath)
							})
						);
					} else {
						console.error("Invalid directory name: " + directoryName);
					}
				}
			});
	}

	/**
	 * Dialog that allows to insert a name.
	 * @params `string` - current name
	 * @returns `string` - new name
	 */
	openRenameDialog(currentName: string): Observable<string> {
		return this.dialog.open(RenameDialog, { data: currentName }).afterClosed();
	}
}
