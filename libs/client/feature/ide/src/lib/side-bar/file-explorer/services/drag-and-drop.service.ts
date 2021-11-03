import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { Injectable } from "@angular/core";
import {
	DirectoryActions,
	DirectorySelectors,
	FileActions,
	FileSelectors
} from "@kling/client/data-access/state";
import { ToastService } from "@kling/client/shared/services";
import { createDirectory, createFile, Directory, File as FileModel } from "@kling/programming";
import { Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { firstValueFrom } from "rxjs";

interface FileEntry {
	filesystem: any;
	fullPath: string;
	isDirectory: boolean;
	isFile: boolean;
	name: string;
}

@Injectable({ providedIn: "root" })
export class DragAndDropService {
	dropListIds = [];

	constructor(
		private readonly store: Store,
		private readonly toast: ToastService,
		private readonly translate: TranslateService
	) {
		this.store.select(DirectorySelectors.selectAllDirectories).subscribe(directories => {
			// https://github.com/angular/components/issues/16671
			// Dealing with nested drop lists is tricky ...
			// Sorting by depth changes the internal priority and allows dropping to nested lists
			// BUG: Start of drag in nested folder always causes item to be moved to parent folder
			this.dropListIds = this.sortDirectoriesByDepth(directories);
		});
	}

	private sortDirectoriesByDepth(directories: Directory[]): string[] {
		const directoriesWithDepth = directories.map(d => {
			const split = d.path.split("/");
			return { path: d.path, level: split.length };
		});

		directoriesWithDepth.sort((a, b) => b.level - a.level);
		return directoriesWithDepth.map(d => d.path);
	}

	async onFileMoved(event: CdkDragDrop<FileModel[]>): Promise<void> {
		const droppedFile = event.item.data as FileModel;
		const hasNameConflict = event.container.data.find(f => f.name === droppedFile.name);

		if (hasNameConflict) {
			const message = this.translate.instant("Error.FileAlreadyExistsAtLocation", {
				filename: droppedFile.name
			});
			this.toast.error(message);
			return;
		}

		const selectedFilePath = await firstValueFrom(
			this.store.select(FileSelectors.selectSelectedFilePath)
		);
		const movedFile = createFile(droppedFile.name, event.container.id, droppedFile.content);

		this.store.dispatch(FileActions.deleteFile({ file: droppedFile }));
		this.store.dispatch(FileActions.addFile({ file: movedFile }));

		if (droppedFile.path === selectedFilePath) {
			this.store.dispatch(FileActions.setSelectedFile({ path: movedFile.path }));
		}
	}

	async onDrop(event: DragEvent): Promise<void> {
		const items = event.dataTransfer.items;

		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (item.kind === "file") {
				const entry = item.webkitGetAsEntry() as FileEntry;
				await this.convertEntryToDirectoryOrFile(entry, "");
			}
		}
	}

	private async convertEntryToDirectoryOrFile(entry: FileEntry, parentDirectoryId: string) {
		if (entry.isFile) {
			const file = await this.getFileFromEntry(entry);
			const content = await this.readFileContent(file as any);
			const fileModel = createFile(entry.name, parentDirectoryId, content);
			this.store.dispatch(FileActions.addFile({ file: fileModel }));
		} else if (entry.isDirectory) {
			const subdirectory = createDirectory(entry.name, parentDirectoryId);
			this.store.dispatch(
				DirectoryActions.addDirectory({
					directory: subdirectory
				})
			);
			await this.convertEntryToDirectory(entry, subdirectory.path);
		}
	}

	private async convertEntryToDirectory(
		entry: FileEntry,
		parentDirectoryId: string
	): Promise<any> {
		const entriesOfDirectory = await this.parseDirectoryEntry(entry);

		entriesOfDirectory.forEach(async fileEntry => {
			await this.convertEntryToDirectoryOrFile(fileEntry, parentDirectoryId);
		});
	}

	private parseDirectoryEntry(directoryEntry: any): Promise<FileEntry[]> {
		const directoryReader = directoryEntry.createReader();
		return new Promise((resolve, reject) => {
			directoryReader.readEntries(
				entries => {
					resolve(entries);
				},
				err => {
					reject(err);
				}
			);
		});
	}

	private async getFileFromEntry(fileEntry): Promise<File> {
		return new Promise((resolve, reject) => fileEntry.file(resolve, reject));
	}

	private readFileContent(file: File): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			if (!file) {
				resolve("");
			}

			const reader = new FileReader();

			reader.onload = e => {
				const text = reader.result.toString();
				resolve(text);
			};

			reader.readAsText(file);
		});
	}
}
