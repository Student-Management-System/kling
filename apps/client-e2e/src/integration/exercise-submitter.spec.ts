import { useAccount } from "../support/auth";
import { Select } from "@web-ide/testing";

const coursesUrl = "**/users/**/courses";
const assignmentsUrl = "**/courses/*/assignments";
const assignmentGroupsUrl = "**/users/*/courses/**/assignments/groups";

const listVersionsUrl = "**/submission/*/*/*/versions";

const course = "test-course-1-wise2122";

describe("Exercise Submitter", () => {
	beforeEach(() => {
		cy.intercept("GET", coursesUrl, {
			fixture: "student-mgmt/courses"
		}).as("courses");

		cy.intercept("GET", assignmentsUrl, {
			fixture: "student-mgmt/assignments"
		}).as("assignments");

		cy.intercept("GET", assignmentGroupsUrl, {
			fixture: "student-mgmt/assignment-groups"
		}).as("assignment-groups");

		cy.intercept("GET", listVersionsUrl, {
			fixture: "student-mgmt/assignment-groups"
		}).as("versions");

		useAccount();
		cy.visit("#submit");
	});

	it("Navigate to Exercise Submitter -> Displays Exercise Submitter", () => {
		cy.getBySelector(Select.exerciseSubmitter.title).should(
			"contain.text",
			"Exercise Submitter"
		);
	});

	describe("Courses-Page", () => {
		it("Contains courses and breadcrumb", () => {
			cy.getBySelector(Select.exerciseSubmitter.coursesBreadcrumb).should(
				"contain.text",
				"Courses"
			);
			cy.getBySelector(Select.exerciseSubmitter.course).should("have.length", 3);
		});

		it("Clicking on course -> Displays Assignments-Page", () => {
			cy.getBySelector(Select.exerciseSubmitter.course).first().click();
			cy.url().should("include", "course=" + course);
			cy.getBySelector(Select.exerciseSubmitter.courseBreadcrumb).should(
				"contain.text",
				course
			);
			cy.getBySelector(Select.exerciseSubmitter.assignment).should("have.length", 3);
		});
	});

	describe("Assignments-Page", () => {
		beforeEach(() => {
			cy.visit("?course=" + course + "#submit");
		});
		it("Contains assignments", () => {
			cy.getBySelector(Select.exerciseSubmitter.assignment).should("have.length", 3);
		});

		it.only("Clicking on assignment -> Displays Assignment-Page", () => {
			cy.getBySelector(Select.exerciseSubmitter.assignment).first().click();
			cy.getBySelector(Select.exerciseSubmitter.assignmentBreadcrumb).should(
				"contain.text",
				"Assignment-01"
			);
			cy.getBySelector(Select.button.submit).should("be.visible");
		});
	});
});
