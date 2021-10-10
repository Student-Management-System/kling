import { Select } from "../support/element-selector";
import { createDefaultProject, defaultProject } from "../support/mock-data";

function openWorkspaceWith(project?: string, file?: string): void {
	cy.visit("/ide", {
		qs: {
			project: project,
			file: file
		}
	});
}

describe("Workspace", () => {
	describe("On Initial Navigation", () => {
		describe("URL Query Parameter: project", () => {
			it("Not set -> Loads empty Playground", () => {
				openWorkspaceWith(undefined, undefined);

				// Playground opened
				cy.getBySelector(Select.sidebar.explorer.projectName)
					.contains("Playground", { matchCase: false })
					.should("exist");

				// No files loaded
				cy.getBySelector(Select.fileExplorer.file).should("not.exist");

				cy.get("#editor").should("not.be.visible");
			});

			it("Set to test-project -> Loads test-project", () => {
				createDefaultProject();

				openWorkspaceWith(defaultProject.projectName);

				// test-project opened
				cy.getBySelector(Select.sidebar.explorer.projectName)
					.contains(defaultProject.projectName, { matchCase: false })
					.should("exist");

				cy.getBySelector(Select.fileExplorer.file).contains(defaultProject.files[0].name);

				cy.get("#editor").should("not.be.visible");
			});
		});

		describe("URL Query Parameter: file", () => {
			it("Set -> Loads project and opens file", () => {
				createDefaultProject();

				const file = defaultProject.files[0].path;

				openWorkspaceWith(defaultProject.projectName, file);

				// test-project opened
				cy.getBySelector(Select.sidebar.explorer.projectName)
					.contains(defaultProject.projectName, { matchCase: false })
					.should("exist");

				// File selected
				const filename = defaultProject.files[0].name;

				cy.getBySelector(Select.fileTabs.tab).contains(filename);
				cy.getBySelector(Select.fileExplorer.file)
					.contains(filename)
					.parent()
					.should("have.class", "selected");
				cy.get("#editor").should("be.visible");
			});
		});
	});
});
