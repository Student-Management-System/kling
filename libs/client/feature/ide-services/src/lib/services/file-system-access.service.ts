/* eslint-disable @typescript-eslint/no-non-null-assertion */
/// <reference types="wicg-file-system-access" />
import { Injectable } from "@angular/core";
import {
	DirectoryActions,
	DirectorySelectors,
	FileActions,
	FileSelectors,
	WorkspaceActions,
	WorkspaceSelectors
} from "@kling/client/data-access/state";
import { FsProject, IndexedDbService } from "@kling/indexed-db";
import {
	createDirectoriesFromFiles,
	createDirectory,
	createFile,
	Directory,
	File
} from "@kling/programming";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import {
	directoryOpen,
	fileOpen,
	fileSave,
	FileWithDirectoryHandle,
	FileWithHandle
} from "browser-fs-access";
import { saveAs } from "file-saver";
import * as JSZip from "jszip";
import { nanoid } from "nanoid";
import { BehaviorSubject, firstValueFrom, Subscription } from "rxjs";

@Injectable({ providedIn: "root" })
export class FileSystemAccess {
	hasSynchronizedDirectory = false;

	private synchronizedDirectory$ = new BehaviorSubject<FileSystemDirectoryHandle | null>(null);
	private fileWithHandleByPath = new Map<string, FileWithHandle>();

	private fileSystemHandleByPath = new Map<string, FileSystemFileHandle>();
	private directoryHandleByPath = new Map<string, FileSystemDirectoryHandle>();
	private subscriptions?: Subscription[];

	constructor(
		private readonly indexedDb: IndexedDbService,
		private readonly store: Store,
		private readonly actions$: Actions
	) {
		this.synchronizedDirectory$.subscribe(enabled => {
			this.hasSynchronizedDirectory = !!enabled;

			if (enabled) {
				this.subscriptions = this.createDirectoryRelatedSubscriptions();
			} else {
				this.subscriptions?.forEach(s => s.unsubscribe());
			}
		});
	}

	private createDirectoryRelatedSubscriptions(): Subscription[] {
		return [
			this.actions$.pipe(ofType(FileActions.addFile)).subscribe(async action => {
				await this.addFileToSynchronizedDirectory(action.file);
			}),

			this.actions$.pipe(ofType(FileActions.deleteFile)).subscribe(async ({ file }) => {
				const directoryHandle = this.directoryHandleByPath.get(file.directoryPath);
				this.fileSystemHandleByPath.delete(file.path);
				await directoryHandle!.removeEntry(file.name);
			}),

			this.actions$
				.pipe(ofType(DirectoryActions.addDirectory))
				.subscribe(async ({ directory }) => {
					const parentDirectoryHandle = this.directoryHandleByPath.get(
						directory.parentDirectoryPath!
					);

					const directoryHandle = await parentDirectoryHandle!.getDirectoryHandle(
						directory.name,
						{ create: true }
					);

					this.directoryHandleByPath.set(directory.path, directoryHandle);
				}),

			this.actions$
				.pipe(ofType(DirectoryActions.deleteDirectory))
				.subscribe(async ({ directory }) => {
					const parentDirectoryHandle = this.directoryHandleByPath.get(
						directory.parentDirectoryPath!
					);

					if (!parentDirectoryHandle) {
						console.error(
							"(Parent) Directory not found: " + directory.parentDirectoryPath
						);
						return;
					}

					const directoryHandle = this.directoryHandleByPath.get(directory.path);

					if (!directoryHandle) {
						console.error("Directory not found: " + directory.path);
						return;
					}

					await parentDirectoryHandle.removeEntry(directoryHandle.name, {
						recursive: false
					});

					const { files, directories } = await this.traverseDirectory(directoryHandle);
					files.forEach(file => {
						this.fileSystemHandleByPath.delete(file.path);
						this.store.dispatch(FileActions.deleteFile({ file }));
					});
					directories.forEach(d => {
						this.directoryHandleByPath.delete(d.path);
						this.store.dispatch(DirectoryActions.deleteDirectory({ directory: d }));
					});
				})
		];
	}

	/**
	 * Opens a file picker that lets the user select one or multiple files.
	 * Once the user has selected one or more files, the files will be added to the project.
	 */
	async importFile(directoryPath = ""): Promise<void> {
		const filesFromFs = await this.openFilePicker();
		console.log(filesFromFs);

		if (!filesFromFs) {
			return;
		}

		const files = await firstValueFrom(this.store.select(FileSelectors.selectAllFiles));

		for await (const fileFromFs of filesFromFs) {
			const file = createFile(fileFromFs.name, directoryPath, await fileFromFs.text());

			if (files.find(f => f.path === file.path)) {
				// Replace file, if it already exists
				console.log(`Replacing file: ${file.path}`);
				this.store.dispatch(FileActions.deleteFile({ file }));
			}

			this.store.dispatch(FileActions.addFile({ file }));
		}
	}

	/** Opens a file picker and returns the selected file or `null`, if user cancelled the operation. */
	private async openFilePicker(): Promise<FileWithHandle[] | null> {
		try {
			return await fileOpen({ multiple: true });
		} catch (error) {
			// User probably closed the dialog without selecting a file
			return null;
		}
	}

	async importFolder(parentDirectory = ""): Promise<void> {
		const directoryFromFs = await this.openFolderPicker();

		if (!directoryFromFs) {
			return;
		}

		const files: File[] = [];
		const directoriesOfParent = await firstValueFrom(
			this.store.select(DirectorySelectors.selectSubdirectories(parentDirectory))
		);

		const selectedFolderName = (
			(directoryFromFs[0] as any)?.webkitRelativePath as string
		).split("/")[0];
		const directoryWithSameName = directoriesOfParent.find(d => d.name === selectedFolderName);

		if (directoryWithSameName) {
			console.log(`Replacing folder: ${selectedFolderName}`);
			this.store.dispatch(
				DirectoryActions.deleteDirectory({ directory: directoryWithSameName })
			);
		}

		for await (const fileFromFs of directoryFromFs) {
			const relativePath = (fileFromFs as any).webkitRelativePath as string;
			const directoryHierarchy = relativePath.split("/");

			// Remove filename part of directoryHierarchy
			const name = directoryHierarchy.splice(-1)[0];
			const directoryPath = directoryHierarchy.length > 0 ? directoryHierarchy.join("/") : "";
			const path =
				parentDirectory === "" ? relativePath : `${parentDirectory}/${relativePath}`;
			const content = await fileFromFs.text();

			const file: File = { path, name, directoryPath, content, hasUnsavedChanges: false };
			files.push(file);
		}

		const directories = createDirectoriesFromFiles(files);

		this.store.dispatch(DirectoryActions.addDirectories({ directories }));
		files.forEach(file => this.store.dispatch(FileActions.addFile({ file })));
	}

	/** Opens a folder picker and returns the selected folder or `null`, if user cancelled the operation. */
	private async openFolderPicker(): Promise<FileWithDirectoryHandle[] | null> {
		try {
			return await directoryOpen({ recursive: true });
		} catch (error) {
			// User probably closed the dialog without selecting a folder
			return null;
		}
	}

	async openDirectoryAndSynchronize(): Promise<void> {
		if (!window.showDirectoryPicker) {
			throw new Error("This browser does not support the File System Access API.");
		}

		const directoryHandle = await window.showDirectoryPicker();
		return this.synchronizeWithDirectory(directoryHandle);
	}

	async synchronizeWithDirectory(
		directoryHandle: FileSystemDirectoryHandle,
		openFile = true,
		project?: FsProject
	): Promise<void> {
		const hasPermission = await this.verifyPermission(directoryHandle);

		if (!hasPermission) {
			console.log("User did not grant permissions for file system access.");
			return;
		}

		this.fileSystemHandleByPath.clear();

		const { files, directories } = await this.traverseDirectory(directoryHandle);

		const projectName = project ? project.name : directoryHandle.name + "-" + nanoid(6);

		await this.indexedDb.projects.put({
			name: projectName,
			source: "fs",
			lastOpened: new Date(),
			directoryHandle
		});

		this.store.dispatch(
			WorkspaceActions.loadProject({
				directories: directories,
				files: files,
				projectName
			})
		);

		if (openFile) {
			this.store.dispatch(FileActions.setSelectedFile({ path: files?.[0]?.path ?? null }));
		}

		this.directoryHandleByPath.set("", directoryHandle);
		this.synchronizedDirectory$.next(directoryHandle);
	}

	/**
	 * Traverses the given {@link FileSystemDirectoryHandle} recursively, collects all files and
	 * subdirectories, and returns them.
	 *
	 * @param directoryHandle The directory to traverse, see {@link window.showDirectoryPicker}.
	 * @param parentPath Path of the containing directory. Defaults to `""`. Used in recursive calls.
	 * @return {*} Object containing all files and directories that were inside the directory.
	 */
	private async traverseDirectory(
		directoryHandle: globalThis.FileSystemDirectoryHandle,
		parentPath = ""
	): Promise<{
		files: File[];
		directories: Directory[];
	}> {
		const result: {
			files: File[];
			directories: Directory[];
		} = {
			files: [],
			directories: []
		};

		for await (const entry of directoryHandle.values()) {
			if (entry.kind === "file") {
				const fileFromFs = await entry.getFile();
				const content = await fileFromFs.text();

				const file = createFile(fileFromFs.name, parentPath, content);
				this.fileSystemHandleByPath.set(file.path, entry);
				result.files.push(file);
			} else {
				const directory = createDirectory(entry.name, parentPath);
				this.directoryHandleByPath.set(directory.path, entry);
				result.directories.push(directory);

				const _result = await this.traverseDirectory(entry, directory.path);
				result.directories.push(..._result.directories);
				result.files.push(..._result.files);
			}
		}

		return result;
	}

	async saveSynchronizedFile(path: string, content: string): Promise<void> {
		const handle = this.fileSystemHandleByPath.get(path);

		if (!handle) {
			console.error("No FileSystemHandle found: " + path);
			return;
		}

		const writeable = await handle.createWritable();
		await writeable.write(content);
		await writeable.close();
	}

	private async addFileToSynchronizedDirectory(file: File): Promise<void> {
		const directoryHandle = this.directoryHandleByPath.get(file.directoryPath);

		if (!directoryHandle) {
			console.error("Directory not found: " + file.directoryPath);
			return;
		}

		const fileHandle = await directoryHandle.getFileHandle(file.name, { create: true });
		this.fileSystemHandleByPath.set(file.path, fileHandle);
		this.saveSynchronizedFile(file.path, file.content);
	}

	/**
	 * Writes the given `content` back to the file associated with the specified `path`.
	 * Can only be used for files that were opened via {@link importFile} or {@link importFolder}
	 * (meaning files that actually exist in the user's file system).
	 *
	 * @param path Absolute path of a file in the project (not in the file system!). See {@link File.path}.
	 * @param content Content of the file.
	 */
	async saveFile(path: string, content: string): Promise<void> {
		const fileWithHandle = this.fileWithHandleByPath.get(path);

		if (!fileWithHandle) {
			console.error("FileHandle not found: " + path);
			return;
		}

		try {
			await fileSave(
				new Blob([content]),
				{
					fileName: fileWithHandle.name,
					mimeTypes: ["text/plain"]
				},
				fileWithHandle.handle,
				true
			);
		} catch (error) {
			console.error("Failed to save file: " + path);
			console.error(error);
		}
	}

	/**
	 * Creates a `.zip` file that contains the currently opened project and allows the user to
	 * download it.
	 */
	async exportAsZip(): Promise<void> {
		const files = await firstValueFrom(this.store.select(FileSelectors.selectAllFiles));
		const projectName = await firstValueFrom(
			this.store.select(WorkspaceSelectors.selectProjectName)
		);

		const zip = new JSZip();

		files.forEach(file => {
			// Add file to zip (automatically creates folders where necessary)
			zip.file(file.path, file.content);
		});

		const zipBlob = await zip.generateAsync({ type: "blob" });

		saveAs(zipBlob, `${projectName}.zip`);
	}

	private async verifyPermission(handle: FileSystemDirectoryHandle): Promise<boolean> {
		// Check if permission was already granted. If so, return true.
		if ((await handle.queryPermission({ mode: "readwrite" })) === "granted") {
			return true;
		}
		// Request permission. If the user grants permission, return true.
		if ((await handle.requestPermission({ mode: "readwrite" })) === "granted") {
			return true;
		}
		// The user didn't grant permission, so return false.
		return false;
	}
}
