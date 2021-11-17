import { useAccount } from "../support/auth";
import { Select } from "@web-ide/testing";

const coursesUrl = "**/users/**/courses";
const assignmentsUrl = "**/courses/*/assignments";
const assignmentUrl = "**/courses/*/assignments/*";
const groupUrl = "**/users/*/courses/*/assignments/*/group";

const exerciseSubmitter_listVersionsUrl = "**/submission/*/*/*/versions";
const exerciseSubmitter_getVersionUrl = "**/submission/*/*/*/1637072123";

const course = "test-course-1-wise2122";

describe("Exercise Submitter", () => {
	beforeEach(() => {
		cy.intercept("GET", coursesUrl, {
			fixture: "student-mgmt/courses"
		}).as("courses");

		cy.intercept("GET", assignmentsUrl, {
			fixture: "student-mgmt/assignments"
		}).as("assignments");

		cy.intercept("GET", assignmentUrl, {
			fixture: "student-mgmt/assignment"
		}).as("assignment");

		cy.intercept("GET", groupUrl, {
			fixture: "student-mgmt/group"
		}).as("group");

		cy.intercept("GET", exerciseSubmitter_listVersionsUrl, {
			fixture: "exercise-submitter/list-versions"
		}).as("list-versions");

		cy.intercept("GET", exerciseSubmitter_getVersionUrl, {
			fixture: "exercise-submitter/get-version"
		}).as("get-version");

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

		it("Clicking on assignment -> Displays Assignment-Page", () => {
			cy.getBySelector(Select.exerciseSubmitter.assignment).first().click();
			cy.getBySelector(Select.exerciseSubmitter.assignmentBreadcrumb).should(
				"contain.text",
				"Assignment-01"
			);
			cy.getBySelector(Select.button.submit).should("be.visible");
		});
	});

	describe.only("Version List", () => {
		beforeEach(() => {
			cy.getBySelector(Select.exerciseSubmitter.course).first().click();
			cy.getBySelector(Select.exerciseSubmitter.assignment).first().click();
			cy.contains("Previous Submissions").click();
		});

		it("Should navigate to version list", () => {
			cy.getBySelector(Select.exerciseSubmitter.versionList.reload).should("exist");
		});

		describe("Replay", () => {
			it("Asks user to confirm -> Overwrites current project", () => {
				cy.getBySelector(Select.exerciseSubmitter.versionList.replay).first().click();
				cy.getBySelector(Select.button.confirm).click();

				cy.contains("Main.java");
			});
		});
	});
});
