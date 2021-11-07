import { createFile, File } from "@kling/programming";
import { Select } from "../support/element-selector";

describe("File", () => {
	const file = createFile("test.ts", undefined, "// test");

	beforeEach(() => {
		cy.clearIndexedDb();
		cy.visit("/");
		addFileWithUi(file);
	});

	describe("Unsaved File Indicator", () => {
		it("Newly added file -> Not marked as saved", () => {
			cy.getBySelector(Select.fileTabs.tab).contains(file.name).should("exist");
			cy.getBySelector(Select.fileExplorer.file).contains(file.name).should("exist");

			cy.getBySelector(Select.file.unsavedChangesIndicator).should("not.exist");
			cy.getBySelector(Select.fileTabs.unsavedChangesIndicator).should("not.exist");
		});

		it("Typing in a file -> Displays unsaved changes indicator", () => {
			cy.get("#editor").type("hello");

			cy.getBySelector(Select.file.unsavedChangesIndicator).should("exist");
			cy.getBySelector(Select.fileTabs.unsavedChangesIndicator).should("exist");
		});

		it("Saving file -> Removes unsaved changes indicator", () => {
			cy.get("#editor").type("hello");

			cy.getBySelector(Select.file.unsavedChangesIndicator).should("exist");
			cy.getBySelector(Select.fileTabs.unsavedChangesIndicator).should("exist");

			cy.get("#editor").type("{ctrl}s");

			cy.getBySelector(Select.file.unsavedChangesIndicator).should("not.exist");
			cy.getBySelector(Select.fileTabs.unsavedChangesIndicator).should("not.exist");
		});
	});
});

function addFileWithUi(file: File) {
	cy.getBySelector(Select.fileExplorer.button.addFile).click();
	cy.getBySelector(Select.dialog.createFile.fileNameInput).type(file.name);
	cy.getBySelector(Select.button.create).click();
}
