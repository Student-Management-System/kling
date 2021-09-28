import { Injectable } from "@angular/core";
import { Directory, File } from "@kling/client/data-access/state";
import Dexie from "dexie";

@Injectable({
	providedIn: "root"
})
export class IndexedDbService {
	private db: WebIdeDatabase;

	constructor() {
		this.db = new WebIdeDatabase();
	}

	async putProject(project: StoredProject): Promise<void> {
		await this.db.projects.put(project, project.name);
	}

	getProjects(): Promise<StoredProject[]> {
		return this.db.projects.reverse().sortBy("lastOpened");
	}

	getProjectByName(projectName: string): Promise<StoredProject> {
		return this.db.projects.get(projectName);
	}

	deleteProject(projectName: string): Promise<void> {
		return this.db.projects.delete(projectName);
	}
}

class WebIdeDatabase extends Dexie {
	projects: Dexie.Table<StoredProject, string>;

	constructor() {
		super("WebIdeDatabase", { autoOpen: true });

		this.version(1).stores({
			projects: "name, lastOpened"
		});

		this.projects = this.table("projects");
	}
}

type BaseProject = {
	readonly name: string;
	readonly lastOpened: Date;
	readonly source: string;
};

export type InMemoryProject = BaseProject & {
	readonly source: "in-memory";
	readonly project: {
		readonly files: File[];
		readonly directories: Directory[];
	};
};

export type FsProject = BaseProject & {
	readonly source: "fs";
	readonly directoryHandle?: FileSystemDirectoryHandle;
};

export type StoredProject = InMemoryProject | FsProject;
