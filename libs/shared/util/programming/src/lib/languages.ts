export type SupportedLanguage = "typescript" | "javascript" | "java" | "python";
export type FileExtension = "ts" | "js" | "java" | "py" | "";

const languageExtensionMap: { [Language in SupportedLanguage]: FileExtension } = {
	typescript: "ts",
	javascript: "js",
	java: "java",
	python: "py"
} as const;

type Extension<Lang extends SupportedLanguage> = typeof languageExtensionMap[Lang];

/**
 * Inspects the extension of the given `filename` to infer its corresponding programming language.
 *
 * @param filename Name of a file incl. its file extension, i.e., `cat.ts`.
 * @return {string | null} String or null, if file extension is missing or unknown.
 */
export function getLanguageFromFilename(filename: string): string | null {
	return getLanguageFromExtension(extractFileExtension(filename));
}

/**
 * Returns the corresponding file extension for a specified programming language or file type.
 */
export function getFileExtension<Language extends SupportedLanguage>(
	language: Language
): Extension<Language> {
	return languageExtensionMap[language];
}

/**
 * Extracts the file extension from a file name. Returns an empty string, if the file name does not
 * contain an extension.
 */
export function extractFileExtension(filename: string): FileExtension {
	const split = filename.split(".");
	const extension = split[split.length - 1];
	return (extension ?? "") as FileExtension;
}

/**
 * Returns the name of the programming language that belongs to this file extension.
 * If no matching language is found, returns `null`.
 */
export function getLanguageFromExtension(extension: FileExtension): SupportedLanguage | null {
	for (const [language, ext] of Object.entries(languageExtensionMap)) {
		if (ext === extension) {
			return language as SupportedLanguage;
		}
	}
	return null;
}
