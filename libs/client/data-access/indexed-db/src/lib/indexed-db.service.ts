import { Injectable } from "@angular/core";
import { FileTable } from "./tables/file-table";
import { ProjectTable } from "./tables/project-table";
import { WebIdeDatabase } from "./web-ide-database";

/**
 * Service that provides access to the browser's `indexed-db`.
 */
@Injectable({ providedIn: "root" })
export class IndexedDbService {
	private db: WebIdeDatabase;

	readonly projects: ProjectTable;
	readonly files: FileTable;

	constructor(indexedDB?: any) {
		this.db = new WebIdeDatabase(indexedDB);
		this.projects = new ProjectTable(this.db);
		this.files = new FileTable(this.db);
	}
}
