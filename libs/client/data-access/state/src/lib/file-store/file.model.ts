export interface File {
	path: string;
	name: string;
	directoryPath: string;
	content: string;
}

export function createFile(name: string, directoryId: string, content = ""): File {
	return {
		path: directoryId + "/" + name,
		name,
		directoryPath: directoryId,
		content
	};
}
