import {
	File,
	createFile,
	createDirectoriesFromFiles,
	Directory,
	createDirectory,
	createDirectoriesFromPath
} from "../src";
describe("Directory", () => {
	describe("createDirectory", () => {
		it("No parent directory -> Uses name as path", () => {
			const dirName = "a";
			const directory = createDirectory(dirName);
			expect(directory.name).toEqual(dirName);
			expect(directory.path).toEqual(dirName);
			expect(directory.parentDirectoryPath).toBeUndefined();
		});

		it("With parent directory -> {parentPath}/{dirName}", () => {
			const dirName = "c";
			const parentPath = "a/b";
			const directory = createDirectory(dirName, parentPath);
			expect(directory.name).toEqual(dirName);
			expect(directory.path).toEqual(`${parentPath}/${dirName}`);
			expect(directory.parentDirectoryPath).toEqual(parentPath);
		});
	});

	describe("createDirectoriesFromFiles", () => {
		it("All files on root level -> Returns empty array", () => {
			const files: File[] = [createFile("a.ts"), createFile("b.ts"), createFile("c.ts")];
			const directories = createDirectoriesFromFiles(files);
			expect(directories.length).toEqual(0);
		});

		it("All files in /subfolder -> Returns [subfolder]", () => {
			const files: File[] = [
				createFile("a.ts", "subfolder"),
				createFile("b.ts", "subfolder")
			];

			const directories = createDirectoriesFromFiles(files);
			const dir = directories[0];

			expect(directories.length).toEqual(1);
			expect(dir.name).toEqual("subfolder");
			expect(dir.path).toEqual("subfolder");
			expect(dir.parentDirectoryPath).toBeUndefined();
		});

		it("Multiple files on various levels between [one, two, three] -> Returns [one, two, three]", () => {
			const files: File[] = [
				createFile("a.ts", "one/two/three"),
				createFile("b.ts", "one/two"),
				createFile("c.ts", "one/two"),
				createFile("d.ts", "one"),
				createFile("e.ts")
			];

			const directories = createDirectoriesFromFiles(files);

			const expected: Directory[] = [
				createDirectory("one"),
				createDirectory("two", "one"),
				createDirectory("three", "one/two")
			];

			expect(directories).toEqual(expected);
		});
	});

	describe("createDirectoriesFromHierarchy", () => {
		it.each([
			// Description - Path - Expected
			["Single level: a -> a", "a", [createDirectory("a")]],
			["Nested: a, b -> a, a/b", "a/b", [createDirectory("a"), createDirectory("b", "a")]],
			[
				"Deeply nested: a, b, c -> a, a/b, a/b/c",
				"a/b/c",
				[createDirectory("a"), createDirectory("b", "a"), createDirectory("c", "a/b")]
			]
		])("%s", (_description, path, expected) => {
			const directories = createDirectoriesFromPath(path);
			expect(directories).toEqual(expected);
		});
	});
});
