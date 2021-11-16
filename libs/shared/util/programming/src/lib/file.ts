import { getFileExtension, SupportedLanguage } from "@web-ide/programming";

export type File = {
	/**
	 * Absolute path in this project (incl. file name), i.e., `src/animals/cat.ts`.
	 * Commonly used to uniquely identify files.
	 */
	path: string;
	/**
	 * Name of this file (including file extension), i.e., `cat.ts`.
	 */
	name: string;
	/** Absolute path of this file's directory or empty string, if file is at root level. */
	directoryPath: string;
	/** Initial content of this file. **Not** synchronized with the editor. */
	content: string;
	/** Determines, whether the file has been modified since the last save action.  */
	hasUnsavedChanges: boolean;
};

/**
 * Creates a simple `File` object.
 * @param name Complete name of the file (incl. extension), i.e., `Main.java`.
 * @param language Name of the programming language or file type.
 * @param [directoryPath=""] Path to this file's directory. Defaults to empty string (root directory).
 * @param [content] Initial content of this file. Not synchronized with the editor.
 */
export function createFile(name: string, directoryPath = "", content?: string): File {
	return {
		path: directoryPath?.length > 0 ? directoryPath + "/" + name : name,
		name,
		directoryPath,
		content: content ?? `// ${name}`,
		hasUnsavedChanges: false
	};
}

/**
 * Returns the filename from a path.
 *
 * @example
 * getFileNameFromPath("src/hello/world.ts")
 * // world.ts
 */
export function getFileNameFromPath(path: string): string {
	const split = path.split("/");
	return split[split.length - 1];
}

/**
 * Returns the directory path from a path.
 *
 * @example
 * getDirectoryPathFromPath("src/hello/world.ts")
 * // src/hello
 */
export function getDirectoryPathFromPath(path: string): string {
	const index = path.lastIndexOf("/");

	if (index == -1) {
		return "";
	}

	return path.substring(0, index);
}

export function createMainFile(language: SupportedLanguage): File {
	const name = language === "java" ? "Main" : "main";
	const extension = getFileExtension(language);
	const filename = name + "." + extension;
	const content = getInitialContent(filename, language);
	return createFile(filename, "", content);
}

function getInitialContent(filename: string, language: SupportedLanguage): string {
	switch (language) {
		case "python":
			return "### " + filename;
		default:
			return "// " + filename;
	}
}
