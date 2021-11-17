import { FileDto } from "@student-mgmt/exercise-submitter-api-client";
import {
	createFile,
	File,
	getDirectoryPathFromPath,
	getFileNameFromPath
} from "@web-ide/programming";

export function toBase64(str: string): string {
	return btoa(unescape(encodeURIComponent(str)));
}

export function fromBase64(encodedStr: string): string {
	return decodeURIComponent(escape(window.atob(encodedStr)));
}

export function toFileModel(encodedFile: FileDto): File {
	return createFile(
		getFileNameFromPath(encodedFile.path),
		getDirectoryPathFromPath(encodedFile.path),
		fromBase64(encodedFile.content)
	);
}
