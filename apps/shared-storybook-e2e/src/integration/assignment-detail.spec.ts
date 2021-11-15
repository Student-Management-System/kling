import { ASSIGNMENT_INPROGRESS_GROUP, GROUP_JAVA001, Select } from "@web-ide/testing";
type StoryName = "default" | "without-end-date" | "without-group" | "submission-disabled";
const component = "assignmentdetailcomponent";
describe("AssignmentDetailComponent", () => {
	describe("Default", () => {
		beforeEach(() => cy.visitIFrame<StoryName>(component, "default"));

		it("Displays end date and group", () => {
			const assignment = ASSIGNMENT_INPROGRESS_GROUP;

			cy.getBySelector(Select.assignment.submissionDisabledWarning).should("not.exist");

			cy.contains(assignment.name);
			cy.getBySelector(Select.assignment.endDate);

			const group = GROUP_JAVA001;
			cy.contains(group.name);

			cy.getBySelector(Select.assignment.group);

			group.members.forEach(member => {
				cy.contains(member.displayName);
				cy.contains(member.email);
			});
		});
	});

	describe("Without end date", () => {
		beforeEach(() => cy.visitIFrame<StoryName>(component, "without-end-date"));

		it("Does not display end date", () => {
			cy.getBySelector(Select.assignment.endDate).should("not.exist");
		});
	});

	describe("Without group", () => {
		beforeEach(() => cy.visitIFrame<StoryName>(component, "without-group"));

		it("Does not display group", () => {
			cy.getBySelector(Select.assignment.group).should("not.exist");
		});
	});

	describe("Submission disabled", () => {
		beforeEach(() => cy.visitIFrame<StoryName>(component, "submission-disabled"));

		it("Displays 'Submissions Disabled' warning", () => {
			cy.getBySelector(Select.assignment.submissionDisabledWarning).should("exist");
		});
	});
});
