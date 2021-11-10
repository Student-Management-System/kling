import { File } from "@web-ide/programming";
import Dexie, { DexieOptions } from "dexie";
import { StoredProject } from "./project";

export class WebIdeDatabase extends Dexie {
	projects: Dexie.Table<StoredProject, string>;
	files: Dexie.Table<{ id: string; projectName: string; file: File }, string>;

	constructor(indexedDB?: DexieOptions["indexedDB"]) {
		super("WebIdeDatabase", { autoOpen: true, indexedDB });

		this.version(1).stores({
			projects: "name, lastOpened",
			files: "id, projectName, file.path"
		});

		this.projects = this.table("projects");
		this.files = this.table("files");
	}
}

export function createFileId(projectName: string, path: string): string {
	return `${projectName}_${path}`;
}
