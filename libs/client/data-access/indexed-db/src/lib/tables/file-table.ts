import { File } from "@kling/programming";
import { createFileId, WebIdeDatabase } from "../web-ide-database";

export class FileTable {
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
