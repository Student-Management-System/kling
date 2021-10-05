import { Select } from "../support/element-selector";

describe("Create Project", () => {
	beforeEach(() => {
		cy.visit("ide");
	});

	it("Explorer Menu -> Save as new project -> Opens Create Project Dialog", () => {
		cy.getBySelector(Select.sidebar.explorerMenu.button).click();
		cy.getBySelector(Select.sidebar.explorerMenu.saveAsNewProject).click();
		cy.getBySelector(Select.dialog.createProject).should("exist");
	});
});
