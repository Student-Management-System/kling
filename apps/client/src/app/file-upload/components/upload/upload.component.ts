import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { DirectoryActions, FileActions } from "../../../root-store";
import { createDirectory } from "../../../root-store/directory-store/directory.model";
import { createFile, File } from "../../../root-store/file-store/file.model";
import { UploadService } from "../../services/upload.service";

interface FileEntry {
	filesystem: any;
	fullPath: string;
	isDirectory: boolean;
	isFile: boolean;
	name: string;
}

@Component({
	selector: "app-upload",
	templateUrl: "./upload.component.html",
	styleUrls: ["./upload.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadComponent implements OnInit {
	isHovering: boolean;

	constructor(private uploadService: UploadService, private store: Store) {}

	ngOnInit(): void {}

	toggleHover(event: boolean): void {
		this.isHovering = event;
	}

	async onDrop(event): Promise<void> {
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
			const content = await this.uploadService.readFileContent(file as any);
			this.store.dispatch(
				FileActions.addFile({
					file: createFile(entry.name, parentDirectoryId, content)
				})
			);
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

	private parseFileEntry(fileEntry: any) {
		return new Promise((resolve, reject) => {
			fileEntry.file(
				file => {
					resolve(file);
				},
				err => {
					reject(err);
				}
			);
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
		try {
			return await new Promise((resolve, reject) => fileEntry.file(resolve, reject));
		} catch (err) {
			console.log(err);
		}
	}
}
