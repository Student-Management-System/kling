export interface Directory {
	path: string;
	parentDirectoryPath?: string;
	name: string;
}

export function createDirectory(name: string, parentDirectoryPath?: string): Directory {
	return {
		path: parentDirectoryPath ? parentDirectoryPath + "/" + name : name,
		parentDirectoryPath,
		name
	};
}
