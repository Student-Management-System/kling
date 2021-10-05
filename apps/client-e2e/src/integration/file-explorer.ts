import { Select } from "../support/element-selector";

function openCreateFileDialog() {
	cy.getBySelector(Select.fileExplorer.button.addFile).click();
}
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
});
