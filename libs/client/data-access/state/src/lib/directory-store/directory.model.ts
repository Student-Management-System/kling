export interface Directory {
	path: string;
	parentDirectoryPath: string;
	name: string;
}

export function createDirectory(name: string, parentDirectoryId?: string): Directory {
	return {
		path: parentDirectoryId ? parentDirectoryId + "/" + name : name,
		parentDirectoryPath: parentDirectoryId,
		name
	};
}
