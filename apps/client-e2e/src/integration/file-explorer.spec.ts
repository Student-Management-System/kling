import { loadProject } from "libs/client/data-access/state/src/lib/workspace-store/workspace.actions";
import { Select } from "../support/element-selector";
import { defaultProject } from "../support/mock-data";

function openCreateFileDialog() {
	cy.getBySelector(Select.fileExplorer.button.addFile).click();
}

function openCreateDirectoryDialog() {
	cy.getBySelector(Select.fileExplorer.button.addDirectory).click();
}

function createDirectoryFromDialog(directoryName: string) {
	openCreateDirectoryDialog();
	cy.getBySelector(Select.dialog.createDirectory.directoryNameInput).type(directoryName);
	cy.getBySelector(Select.button.create).click();
}

function createFileFromDialog(filename: string) {
	openCreateFileDialog();
	cy.getBySelector(Select.dialog.createFile.fileNameInput).type(filename);
	cy.getBySelector(Select.button.create).click();
}

describe("File Explorer", () => {
	beforeEach(() => {
		cy.clearIndexedDb();
		cy.visit("/ide");
	});

	describe("Create File Dialog", () => {
		it("Add File -> Opens Create File Dialog", () => {
			openCreateFileDialog();
			cy.getBySelector(Select.dialog.createFile.container).should("exist");
		});

		it("File added -> Adds File to File Explorer, File Tabs and opens it", () => {
			const filename = "a-new-file.ts";

			createFileFromDialog(filename);

			cy.getBySelector(Select.fileExplorer.file).contains(filename);
			cy.getBySelector(Select.fileTabs.tab).contains(filename);
			cy.get("#editor").contains(`// ${filename}`);
		});
	});

	describe("Create Directory Dialog", () => {
		it("Add Directory -> Opens Create Directory Dialog", () => {
			openCreateDirectoryDialog();
			cy.getBySelector(Select.dialog.createDirectory.container).should("exist");
		});

		it("Directory added -> Adds Directory to File Explorer", () => {
			const directoryName = "subfolder";
			createDirectoryFromDialog(directoryName);
			cy.getBySelector(Select.fileExplorer.directory).contains(directoryName).should("exist");
		});
	});

	describe("File", () => {
		describe("Delete", () => {
			it("Removes the file", () => {
				const filename = "to-be-deleted.ts";

				createFileFromDialog(filename);

				cy.getBySelector(Select.fileExplorer.file).contains(filename).rightclick();
				cy.getBySelector(Select.fileExplorer.fileContextMenu.delete).click();

				cy.getBySelector(Select.button.confirm).click();
				cy.getBySelector(Select.fileExplorer.file).contains(filename).should("not.exist");
				cy.useIndexedDbService(async idb => {
					const files = await idb.files.getFiles("Playground");
					expect(files).empty;
				});
			});
		});
	});

	describe("Directory", () => {
		describe("Add Directory", () => {
			it("Opens Create Directory Dialog and adds subdirectory", () => {
				// Create base directory
				const baseDirectory = "base";
				createDirectoryFromDialog(baseDirectory);

				// Open Create Directory Dialog via context menu
				cy.getBySelector(Select.fileExplorer.directory).rightclick();
				cy.getBySelector(Select.fileExplorer.directoryContextMenu.addDirectory).click();

				// Create new directory in dialog
				const subdirectory = "subdirectory";
				cy.getBySelector(Select.dialog.createDirectory.directoryNameInput).type(
					subdirectory
				);
				cy.getBySelector(Select.button.create).click();

				// New directory should be a child of base directory
				cy.getBySelector(Select.fileExplorer.directory)
					.contains(baseDirectory)
					.parent()
					.contains(subdirectory);
			});
		});

		describe("Add File", () => {
			it("Opens Create File Dialog and adds file to directory", () => {
				// Create base directory
				const baseDirectory = "base";
				createDirectoryFromDialog(baseDirectory);

				// Open Create File Dialog via context menu
				cy.getBySelector(Select.fileExplorer.directory).rightclick();
				cy.getBySelector(Select.fileExplorer.directoryContextMenu.addFile).click();

				// Create new file in dialog
				const filename = "file.ts";
				cy.getBySelector(Select.dialog.createFile.fileNameInput).type(filename);
				cy.getBySelector(Select.button.create).click();

				// New file should be a child of base directory
				cy.getBySelector(Select.fileExplorer.directory)
					.contains(baseDirectory)
					.parent()
					.contains(filename);
			});
		});

		describe("Delete", () => {
			it("Removes directory and its content", () => {
				const directoryName = "to-be-deleted";
				createDirectoryFromDialog(directoryName);

				cy.getBySelector(Select.fileExplorer.directory)
					.contains(directoryName)
					.rightclick();
				cy.getBySelector(Select.fileExplorer.directoryContextMenu.delete).click();
				cy.getBySelector(Select.button.confirm).click();

				cy.getBySelector(Select.fileExplorer.directory)
					.contains(directoryName)
					.should("not.exist");
			});
		});
	});

	describe("Load Project", () => {
		function assertDefaultProjectHasCorrectStructure() {
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
		}
		it("Displays project correctly", () => {
			cy.useStore(store => store.dispatch(loadProject(defaultProject)));
			assertDefaultProjectHasCorrectStructure();
		});
	});
});
