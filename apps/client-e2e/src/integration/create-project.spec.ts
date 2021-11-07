import { Select } from "../support/element-selector";

function openCreateProjectDialog() {
	cy.getBySelector(Select.sidebar.explorerMenu.button).click();
	cy.getBySelector(Select.sidebar.explorerMenu.saveAsNewProject).click();
}

describe("Create Project", () => {
	beforeEach(() => {
		cy.visit("/");
	});

	beforeEach(() => {
		openCreateProjectDialog();
	});

	it("Explorer Menu -> Save as new project -> Opens Create Project Dialog", () => {
		cy.getBySelector(Select.dialog.createProject.container).should("exist");
	});

	it("Create Button is disabled while project name is invalid", () => {
		cy.getBySelector(Select.button.create).should("be.disabled");
		cy.getBySelector(Select.dialog.createProject.projectNameInput).type("a/b");
		cy.getBySelector(Select.button.create).should("be.disabled");
		cy.getBySelector(Select.dialog.createProject.projectNameInput).clear().type("New-Project");
		cy.getBySelector(Select.button.create).should("be.enabled");
	});

	it("On Create -> Navigates to project URL and opens project", () => {
		const project = "New-Project";
		cy.getBySelector(Select.dialog.createProject.projectNameInput).clear().type(project);
		cy.getBySelector(Select.button.create).click();
		cy.url().should("contain", `project=${project}`);
		cy.useIndexedDbService(async idb => {
			const storedProject = await idb.projects.getByName(project);
			expect(storedProject).not.undefined;
		});
		cy.get(".explorer").contains(project);
		cy.useIndexedDbService(async idb => await idb.projects.delete(project));
	});
});
