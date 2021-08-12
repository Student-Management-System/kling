export type SupportedLanguage = "typescript" | "javascript" | "java" | "python";
export type FileExtension = "ts" | "js" | "java" | "py";

const languageExtensionMap: { [Language in SupportedLanguage]: FileExtension } = {
	typescript: "ts",
	javascript: "js",
	java: "java",
	python: "py"
} as const;

type Extension<Lang extends SupportedLanguage> = typeof languageExtensionMap[Lang];
type InferredExtension<Filename> = Filename extends `${string}.${infer Ext}` ? Ext : string;

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
export function extractFileExtension<Filename extends string>(
	filename: Filename
): InferredExtension<Filename> {
	const split = filename.split(".");
	const extension = split[split.length - 1];
	return (extension ?? "") as InferredExtension<Filename>;
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
