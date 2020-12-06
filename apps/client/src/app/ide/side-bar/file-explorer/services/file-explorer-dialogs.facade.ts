import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { DirectoryActions, FileActions } from "../../../../root-store";
import { createDirectory, Directory } from "../../../../root-store/directory-store/directory.model";
import { State as DirectoryState } from "../../../../root-store/directory-store/directory.reducer";
import { createFile, File } from "../../../../root-store/file-store/file.model";
import {
	CreateDirectoryDialog,
	CreateDirectoryDialogData
} from "../dialogs/create-directory/create-directory.dialog";
import { CreateFileDialog } from "../dialogs/create-file/create-file.dialog";
import { RenameDialog } from "../dialogs/rename/rename.dialog";

/**
 * Facade for dialogs that are used in the workspace.
 */
@Injectable()
export class FileExplorerDialogs {
	constructor(private dialog: MatDialog, private store: Store<DirectoryState>) {}

	/**
	 * Opens the `CreateFileDialog` and adds a new file to the workspace,
	 * if confirmed by the user.
	 */
	openCreateFileDialog(fromDirectory: Directory): void {
		this.dialog
			.open<CreateFileDialog, any, Partial<File>>(CreateFileDialog)
			.afterClosed()
			.subscribe(({ name }) => {
				if (name) {
					const file = createFile(name, fromDirectory.path, `// ${name}`);
					this.store.dispatch(FileActions.addFile({ file }));
					this.store.dispatch(FileActions.setSelectedFile({ fileId: file.path }));
				}
			});
	}

	/**
	 * Opens the `CreateDirectoryDialog` and adds a new directory to the workspace,
	 * if confirmed by the user.
	 * If `fromDirectory` was specified, the directory is added as a subdirectory.
	 */
	openCreateDirectoryDialog(fromDirectory: Directory): void {
		const data: CreateDirectoryDialogData = { directory: fromDirectory };
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
								directory: createDirectory(directoryName, fromDirectory.path)
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
