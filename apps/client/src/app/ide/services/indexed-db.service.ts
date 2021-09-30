import { Injectable } from "@angular/core";
import { File } from "@kling/programming";
import Dexie from "dexie";

function createFileId(projectName: string, path: string): string {
	return `${projectName}_${path}`;
}

@Injectable({
	providedIn: "root"
})
export class IndexedDbService {
	private db: WebIdeDatabase;

	readonly projects: ProjectTable;
	readonly files: FileTable;

	constructor() {
		this.db = new WebIdeDatabase();
		this.projects = new ProjectTable(this.db);
		this.files = new FileTable(this.db);
	}
}

class ProjectTable {
	constructor(private readonly db: WebIdeDatabase) {}

	createProject(project: StoredProject, files: File[]): Promise<void> {
		return this.db.transaction("readwrite", this.db.projects, this.db.files, async () => {
			await this.put(project);

			for await (const file of files) {
				await this.db.files.add({
					id: createFileId(project.name, file.path),
					projectName: project.name,
					file
				});
			}
		});
	}

	/**
	 * Adds or updates information about a project.
	 */
	async put(project: StoredProject): Promise<void> {
		await this.db.projects.put(project, project.name);
	}

	/**
	 * Returns all stored projects sorted by their `lastOpened` dates.
	 */
	getMany(): Promise<StoredProject[]> {
		return this.db.projects.reverse().sortBy("lastOpened");
	}

	/**
	 * Returns the project associated with the given `projectName`.
	 */
	getByName(projectName: string): Promise<StoredProject> {
		return this.db.projects.get(projectName);
	}

	/**
	 * Deletes the project associated with the given `projectName`.
	 * Will also delete all related files from the {@link FileTable}.
	 */
	async delete(projectName: string): Promise<void> {
		await this.db.transaction("readwrite", this.db.projects, this.db.files, async () => {
			await Promise.all([
				this.db.projects.delete(projectName),
				this.db.files.where("projectName").equals(projectName).delete()
			]);
		});
	}
}

class FileTable {
	constructor(private readonly db: WebIdeDatabase) {}

	async put(projectName: string, file: File): Promise<void> {
		const id = createFileId(projectName, file.path);
		await this.db.files.put({ id, projectName, file }, id);
	}

	async getFiles(projectName: string): Promise<File[]> {
		return (await this.db.files.where("projectName").equals(projectName).toArray()).map(
			f => f.file
		);
	}

	async delete(projectName: string, path: string): Promise<void> {
		await this.db.files.delete(createFileId(projectName, path));
	}
}

class WebIdeDatabase extends Dexie {
	projects: Dexie.Table<StoredProject, string>;
	files: Dexie.Table<{ id: string; projectName: string; file: File }, string>;

	constructor() {
		super("WebIdeDatabase", { autoOpen: true });

		this.version(1).stores({
			projects: "name, lastOpened",
			files: "id, projectName, file.path"
		});

		this.projects = this.table("projects");
		this.files = this.table("files");
	}
}

type BaseProject = {
	readonly name: string;
	readonly lastOpened: Date;
	readonly source: string;
};

export type InMemoryProject = BaseProject & {
	readonly source: "in-memory";
};

export type FsProject = BaseProject & {
	readonly source: "fs";
	readonly directoryHandle?: FileSystemDirectoryHandle;
};

export type StoredProject = InMemoryProject | FsProject;
