import { FileActions } from "..";
import { reducer, initialState } from "../file.reducer";
import { createFile, File } from "../file.model";

describe("File Reducer", () => {
	let state = reducer(initialState, {} as any);
	let file: File;

	beforeEach(() => {
		// Add initial data
		file = createFile("initial-file.ts", "root", "// initial-file.ts");
		const action = FileActions.addFile({ file });
		state = reducer(initialState, action);
	});

	describe("addFile", () => {
		it("File does not exist -> Adds file", () => {
			const file = createFile("new-file.ts", "root", "// new-file.ts");
			const action = FileActions.addFile({ file });
			const result = reducer(initialState, action);
			expect(result.ids).toContain(file.path);
			expect(result.entities[file.path]).toBeTruthy();
			expect(result.entities[file.path].path).toEqual(file.path);
			expect(result.entities[file.path].directoryPath).toEqual(file.directoryPath);
			expect(result.entities[file.path].name).toEqual(file.name);
			expect(result.entities[file.path].content).toEqual(file.content);
		});

		it("File already exists -> No changes", () => {
			const newContent = "// new file content";
			const alreadyExistingFile = createFile(file.name, file.directoryPath, newContent);
			const actionToAddExistingFile = FileActions.addFile({ file: alreadyExistingFile });
			const result = reducer(state, actionToAddExistingFile);

			expect(result.entities[file.path].content).toEqual(file.content);
		});
	});

	describe("upsertFile", () => {
		it("File does not exist -> Adds file", () => {
			const file = createFile("new-file.ts", "root", "// new-file.ts");
			const action = FileActions.upsertFile({ file });
			const result = reducer(initialState, action);
			expect(result.ids).toContain(file.path);
			expect(result.entities[file.path]).toBeTruthy();
			expect(result.entities[file.path].path).toEqual(file.path);
			expect(result.entities[file.path].directoryPath).toEqual(file.directoryPath);
			expect(result.entities[file.path].name).toEqual(file.name);
			expect(result.entities[file.path].content).toEqual(file.content);
		});

		it("File already exists -> Updates file", () => {
			const file = createFile("new-file.ts", "root", "// new-file.ts");
			const action = FileActions.addFile({ file });
			const state = reducer(initialState, action);

			const newContent = "// new file content";
			const alreadyExistingFile = createFile(file.name, file.directoryPath, newContent);
			const actionToAddExistingFile = FileActions.upsertFile({ file: alreadyExistingFile });
			const result = reducer(state, actionToAddExistingFile);

			expect(result.entities[file.path].content).toEqual(newContent);
		});
	});

	describe("updateFile", () => {
		beforeEach(() => {
			// Add file
			file = createFile("new-file.ts", "root", "// new-file.ts");
			const action = FileActions.addFile({ file });
			state = reducer(initialState, action);
		});

		it("File exists -> Updates file", () => {
			const changedContent = "// new-file.ts with changes";
			const action = FileActions.updateFile({
				file: {
					id: file.path,
					changes: {
						content: changedContent
					}
				}
			});
			const result = reducer(state, action);
			expect(result.entities[file.path].content).toEqual(changedContent);
		});

		it("File does not exist -> Does nothing", () => {
			const changedContent = "// new-file.ts with changes";
			const doesNotExist = "does_not_exist";
			const action = FileActions.updateFile({
				file: {
					id: doesNotExist,
					changes: {
						content: changedContent
					}
				}
			});
			const result = reducer(state, action);
			expect(result.entities[doesNotExist]).toBeFalsy();
		});
	});

	describe("deleteFile", () => {
		it("Deletes the file with given id", () => {
			const action = FileActions.deleteFile({ path: file.path });
			const result = reducer(state, action);
			expect(result.entities[file.path]).toBeFalsy();
			expect(result.ids).toEqual([]);
		});
	});

	describe("clearFiles", () => {
		it("Removes all files", () => {
			const action = FileActions.clearFiles();
			const result = reducer(state, action);
			expect(Object.keys(result.entities).length).toEqual(0);
			expect(result.ids).toEqual([]);
		});
	});

	describe("setSelectedFile", () => {
		it("Sets the selected file", () => {
			const action = FileActions.setSelectedFile({ path: file.path });
			const result = reducer(state, action);
			expect(result.selectedPath).toEqual(file.path);
		});
	});

	describe("Unknown action", () => {
		it("Returns the previous state", () => {
			const action = {} as any;
			const result = reducer(initialState, action);
			expect(result).toBe(initialState);
		});
	});
});
