import { getDirectoryPathFromPath, getFileNameFromPath } from "@web-ide/programming";

describe("File", () => {
	describe("getFileNameFromPath", () => {
		it.each([
			// Path - Expected
			["Test.java", "Test.java"],
			["src/Test.java", "Test.java"],
			["src/subfolder/Test.java", "Test.java"]
		])("%s", (path, expected) => {
			expect(getFileNameFromPath(path)).toEqual(expected);
		});
	});

	describe("getDirectoryPathFromPath", () => {
		it.each([
			// Path - Expected
			["Test.java", ""],
			["src/Test.java", "src"],
			["src/subfolder/Test.java", "src/subfolder"]
		])("%s", (path, expected) => {
			expect(getDirectoryPathFromPath(path)).toEqual(expected);
		});
	});
});
