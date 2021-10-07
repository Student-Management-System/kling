import { createDirectory, createFile } from "@kling/programming";
import { addFile } from "libs/client/data-access/state/src/lib/file-store/file.actions";
import { loadProject } from "libs/client/data-access/state/src/lib/workspace-store/workspace.actions";
import { Select } from "../support/element-selector";

function openCreateFileDialog() {
	cy.getBySelector(Select.fileExplorer.button.addFile).click();
}

function openCreateDirectoryDialog() {
	cy.getBySelector(Select.fileExplorer.button.addDirectory).click();
}

const defaultProject = {
	files: [
		createFile("root-1.ts"),
		createFile("root-2.ts"),
		createFile("level-1-a-1.ts", "level-1-a"),
		createFile("level-1-a-2.ts", "level-1-a"),
		createFile("level-1-b.ts", "level-1-b"),
		createFile("level-2.ts", "level-1-a/level-2")
	],
	directories: [
		createDirectory("level-1-a"),
		createDirectory("level-1-b"),
		createDirectory("level-2", "level-1-a")
	],
	projectName: "test-project"
};

describe("File Explorer", () => {
	beforeEach(() => {
		cy.visit("/ide");
	});

	describe("Create File Dialog", () => {
		beforeEach(() => {
			openCreateFileDialog();
		});

		it("Add File -> Opens Create File Dialog", () => {
			cy.getBySelector(Select.dialog.createFile.container).should("exist");
		});

		it("File added -> Adds File to File Explorer, File Tabs and opens it", () => {
			const filename = "a-new-file.ts";
			cy.getBySelector(Select.dialog.createFile.fileNameInput).type(filename);
			cy.getBySelector(Select.button.create).click();
			cy.getBySelector(Select.fileExplorer.file).contains(filename);
			cy.getBySelector(Select.fileTabs.tab).contains(filename);
			cy.get("#editor").contains(`// ${filename}`);
		});
	});

	describe("Create Directory Dialog", () => {
		beforeEach(() => {
			openCreateDirectoryDialog();
		});

		it("Add Directory -> Opens Create Directory Dialog", () => {
			cy.getBySelector(Select.dialog.createDirectory.container).should("exist");
		});

		it("Directory added -> Adds Directory to File Explorer", () => {
			const directoryName = "subfolder";

			cy.getBySelector(Select.dialog.createDirectory.directoryNameInput).type(directoryName);
			cy.getBySelector(Select.button.create).click();
			cy.getBySelector(Select.fileExplorer.directory).contains(directoryName).should("exist");
		});
	});

	describe("File", () => {
		describe("Delete", () => {
			it("Removes the file", () => {
				cy.useIndexedDbService(async idb => {
					await idb.projects.delete("Playground");
				});

				const filename = "to-be-deleted.ts";
				cy.useStore(store => store.dispatch(addFile({ file: createFile(filename) })));

				cy.getBySelector(Select.fileExplorer.file).contains(filename).rightclick();
				cy.getBySelector(Select.fileExplorer.fileContextMenu.delete).click();

				cy.getBySelector(Select.fileExplorer.file).should("not.exist");
				cy.useIndexedDbService(async idb => {
					const files = await idb.files.getFiles("Playground");
					expect(files).empty;
				});
			});
		});
	});

	describe("Load Project", () => {
		it("Displays project correctly", () => {
			cy.useStore(store => store.dispatch(loadProject(defaultProject)));

			cy.getBySelector(Select.fileExplorer.file).contains("root-1.ts");
			cy.getBySelector(Select.fileExplorer.file).contains("root-2.ts");

			cy.getBySelector(Select.fileExplorer.directory)
				.contains("level-1-a")
				.parent()
				.contains("level-1-a-1.ts");

			cy.getBySelector(Select.fileExplorer.directory)
				.contains("level-1-a")
				.parent()
				.contains("level-1-a-2.ts");

			cy.getBySelector(Select.fileExplorer.directory)
				.contains("level-1-b")
				.parent()
				.contains("level-1-b.ts");

			cy.getBySelector(Select.fileExplorer.directory)
				.contains("level-2")
				.parent()
				.contains("level-2.ts");
		});
	});
});
