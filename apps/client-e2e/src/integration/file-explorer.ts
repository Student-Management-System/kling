import { createFile, File } from "@kling/programming";
import { createAction, props } from "@ngrx/store";
import { Select } from "../support/element-selector";

function openCreateFileDialog() {
	cy.getBySelector(Select.fileExplorer.button.addFile).click();
}

function openCreateDirectoryDialog() {
	cy.getBySelector(Select.fileExplorer.button.addDirectory).click();
}

const addFile = createAction("[Workspace] Add File", props<{ file: File }>());

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
});