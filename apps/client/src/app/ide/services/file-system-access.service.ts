/// <reference types="wicg-file-system-access" />
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
	DirectoryActions,
	FileActions,
	FileSelectors,
	WorkspaceActions
} from "@kling/client/data-access/state";
import { Directory, File, createDirectory, createFile } from "@kling/programming";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { directoryOpen, fileOpen, fileSave, FileWithHandle } from "browser-fs-access";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { nanoid } from "nanoid";
import { BehaviorSubject, Subscription } from "rxjs";
import { take } from "rxjs/operators";
import { IndexedDbService } from "./indexed-db.service";

@Injectable({ providedIn: "root" })
export class FileSystemAccess {
	hasSynchronizedDirectory = false;

	private synchronizedDirectory$ = new BehaviorSubject<FileSystemDirectoryHandle>(null);
	private fileWithHandleByPath = new Map<string, FileWithHandle>();

	private fileSystemHandleByPath = new Map<string, FileSystemFileHandle>();
	private directoryHandleByPath = new Map<string, FileSystemDirectoryHandle>();
	private subscriptions: Subscription[];

	constructor(
		private readonly indexedDb: IndexedDbService,
		private readonly route: ActivatedRoute,
		private readonly router: Router,
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
				await directoryHandle.removeEntry(file.name);
			}),

			this.actions$
				.pipe(ofType(DirectoryActions.addDirectory))
				.subscribe(async ({ directory }) => {
					const parentDirectoryHandle = this.directoryHandleByPath.get(
						directory.parentDirectoryPath
					);

					const directoryHandle = await parentDirectoryHandle.getDirectoryHandle(
						directory.name,
						{ create: true }
					);

					this.directoryHandleByPath.set(directory.path, directoryHandle);
				}),

			this.actions$
				.pipe(ofType(DirectoryActions.deleteDirectory))
				.subscribe(async ({ directory }) => {
					const parentDirectoryHandle = this.directoryHandleByPath.get(
						directory.parentDirectoryPath
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
	 * Opens a file picker that lets the user select a file.
	 * Once the user has selected a file, it will be added to the project and the application will
	 * maintain its `fileHandle`, which allows writing changes back to the file via {@link saveFile}.
	 */
	async openFile(): Promise<void> {
		const fileFromFs = await fileOpen();
		const file = await this.registerFile(fileFromFs);
		this.store.dispatch(FileActions.setSelectedFile({ file }));
	}

	async openDirectory(): Promise<void> {
		const directoryFromFs = await directoryOpen({ recursive: true });

		const files: File[] = [];
		const directories: Directory[] = [];

		for await (const file of directoryFromFs) {
			const directoryPath: string = ((file as any).webkitRelativePath as string).replace(
				"/" + file.name,
				""
			);

			const dirHierarchy = directoryPath.split("/");
			const dirName = dirHierarchy[dirHierarchy.length - 1];
			const parentDir = dirHierarchy.length == 1 ? "" : dirHierarchy[dirHierarchy.length - 2];

			const f: File = {
				path: (file as any).webkitRelativePath,
				name: file.name,
				directoryPath,
				content: await file.text(),
				hasUnsavedChanges: false
			};

			files.push(f);
			directories.push(createDirectory(dirName, parentDir));

			// TODO
		}

		const dirMap = new Map<string, Directory>();
		directories.forEach(dir => dirMap.set(dir.path, dir));
		const dirs = [...dirMap.values()];

		console.log(files);
		console.log(dirs);

		this.store.dispatch(
			WorkspaceActions.loadProject({
				directories: dirs,
				files,
				projectName: files[0].path.split("/")[0]
			})
		);
	}

	async openDirectoryAndSynchronize(): Promise<void> {
		if (!window.showDirectoryPicker) {
			throw new Error("This browser does not support the File System Access API.");
		}

		const directoryHandle = await window.showDirectoryPicker();
		return this.synchronizeWithDirectory(directoryHandle);
	}

	async synchronizeWithDirectory(directoryHandle: FileSystemDirectoryHandle): Promise<void> {
		const hasPermission = await this.verifyPermission(directoryHandle);

		if (!hasPermission) {
			console.log("User did not grant permissions for file system access.");
			return;
		}

		this.fileSystemHandleByPath.clear();

		const { files, directories } = await this.traverseDirectory(directoryHandle);

		const projectName = directoryHandle.name + "-" + nanoid(6);

		this.store.dispatch(
			WorkspaceActions.loadProject({
				directories: directories,
				files: files,
				projectName
			})
		);

		await this.indexedDb.projects.put({
			name: projectName,
			source: "fs",
			lastOpened: new Date(),
			directoryHandle
		});

		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: {
				project: projectName,
				source: "fs"
			}
		});

		this.store.dispatch(FileActions.setSelectedFile({ file: files?.[0] ?? null }));

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
	 * Can only be used for files that were opened via {@link openFile} or {@link openDirectory}
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
	 * Adds the given file to the project and keeps track of its `fileHandle` to enable
	 * writing changes back to it via the {@link saveFile} method.
	 *
	 * @param {FileWithHandle} fileFromFs File that has been opened via {@link fileOpen} or {@link directoryOpen}.
	 * @return {File} The created file model.
	 */
	private async registerFile(fileFromFs: FileWithHandle): Promise<File> {
		const file = createFile(fileFromFs.name, "", await fileFromFs.text());

		this.fileWithHandleByPath.set(file.path, fileFromFs);
		this.store.dispatch(FileActions.addFile({ file }));

		return file;
	}

	/**
	 * Creates a `.zip` file that contains the currently opened project and allows the user to
	 * download it.
	 */
	async exportAsZip(): Promise<void> {
		this.store
			.select(FileSelectors.selectAllFiles)
			.pipe(take(1))
			.subscribe(async files => {
				const zip = new JSZip();

				files.forEach(file => {
					// Add file to zip (automatically creates folders where necessary)
					zip.file(file.path, file.content);
				});

				const zipBlob = await zip.generateAsync({ type: "blob" });

				saveAs(zipBlob, "project.zip");
			});
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
