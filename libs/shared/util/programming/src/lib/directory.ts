import { File } from "..";

export interface Directory {
	path: string;
	parentDirectoryPath: string | null;
	name: string;
}

export function createDirectory(name: string, parentDirectoryPath: string | null = ""): Directory {
	return {
		path: parentDirectoryPath ? parentDirectoryPath + "/" + name : name,
		parentDirectoryPath,
		name
	};
}

/**
 * Given a list of {@link File}s, creates and returns all occurring directories.
 */
export function createDirectoriesFromFiles(files: File[]): Directory[] {
	const directorySet = new Set(
		files.filter(f => f.directoryPath.length > 0).map(f => f.directoryPath)
	);

	const directoryMap = new Map<string, Directory>();

	for (const path of directorySet) {
		const directories = createDirectoriesFromPath(path);
		directories.forEach(dir => directoryMap.set(dir.path, dir));
	}

	return [...directoryMap.values()];
}

/**
 * Creates all directories that occur in the given `directoryPath`.
 * @example
 * const paths = createDirectoriesFromPath("one/two/three")
 * 	.map(d => d.path);
 * console.log(paths) // [one, one/two, one/two/three]
 */
export function createDirectoriesFromPath(directoryPath: string): Directory[] {
	const directories: Directory[] = [];
	const hierarchy = directoryPath.split("/");

	for (let i = 0; i < hierarchy.length; i++) {
		const directory = createDirectory(hierarchy[i], directories[i - 1]?.path);
		directories.push(directory);
	}

	return directories;
}
