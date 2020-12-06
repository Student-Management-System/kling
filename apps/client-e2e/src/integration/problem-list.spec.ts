describe("/problems (problem-list)", () => {
	beforeEach(() => {
		cy.visit("/problems");
	});

	it("Contains 'Problem' in the title", () => {
		cy.get(".title").contains("Problem");
	});

	it("Can navigate to /problem-editor/create", () => {
		cy.get(".title-container > a").contains("Create");
		cy.get(".title-container > a").click();
		cy.url().should("equal", Cypress.config().baseUrl + "/problem-editor/create");
	});

	it("Contains a table with problems", () => {
		cy.get("table");
	});
});
