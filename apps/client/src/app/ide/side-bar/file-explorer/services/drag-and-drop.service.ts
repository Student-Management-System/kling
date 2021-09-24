import { Injectable } from "@angular/core";
import {
	createDirectory,
	createFile,
	DirectoryActions,
	FileActions
} from "@kling/client/data-access/state";
import { Store } from "@ngrx/store";
import { FileSystemAccess } from "../../../services/file-system-access.service";

interface FileEntry {
	filesystem: any;
	fullPath: string;
	isDirectory: boolean;
	isFile: boolean;
	name: string;
}

@Injectable({ providedIn: "root" })
export class DragAndDropService {
	constructor(private store: Store, private fileSystem: FileSystemAccess) {}

	async onDrop(event: DragEvent): Promise<void> {
		const items = event.dataTransfer.items;

		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (item.kind === "file") {
				// If File System Access API is supported
				if (item.getAsFileSystemHandle) {
					console.log("Using File System Access API.");
					const entry = await item.getAsFileSystemHandle();

					if (entry.kind === "directory") {
						await this.fileSystem._synchronizeWithDirectory(entry);
					}
				} else {
					console.log(
						"File System Access API is not supported. Using in-memory filesystem."
					);
					const entry = item.webkitGetAsEntry() as FileEntry;
					await this.convertEntryToDirectoryOrFile(entry, "");
				}
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
