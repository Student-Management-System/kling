type StoryName = "with-end-date" | "without-end-date" | "without-group";
const component = "assignmentdetailcomponent";
describe("AssignmentDetailComponent", () => {
	describe("With End Date", () => {
		beforeEach(() => cy.visitIFrame<StoryName>(component, "with-end-date"));

		it("Displays end date", () => {
			cy.contains("Enddatum");
		});
	});
});
