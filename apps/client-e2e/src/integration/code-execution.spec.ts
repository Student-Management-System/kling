import { createFile } from "@web-ide/programming";
import { Select } from "@web-ide/testing";

const mainPyOutput = "Hello world from main.py";
const secondPyOutput = "Hello world from second.py";

const mainPy = createFile(
	"main.py",
	undefined,
	`# main.py
print("${mainPyOutput}")
`
);

const secondPy = createFile(
	"second.py",
	undefined,
	`# second.py
print("${secondPyOutput}")
`
);

describe("Code Execution", () => {
	before(() => {
		cy.clearIndexedDb();
		cy.visit("/");
		cy.useIndexedDbService(
			async idb =>
				await idb.projects.saveProject(
					{
						lastOpened: new Date(),
						source: "in-memory",
						name: "CodeExecutionTest"
					},
					[mainPy, secondPy]
				)
		);
	});

	beforeEach(() => {
		cy.visit("/", {
			qs: {
				project: "CodeExecutionTest",
				file: "main.py"
			}
		});
	});

	it("No entry point set -> Executes the currently opened file", () => {
		cy.getBySelector(Select.fileExplorer.file).contains(mainPy.name);
		cy.get("#editor").contains("# main.py");
		cy.getBySelector(Select.runCode).click();
		cy.getBySelector(Select.terminal.stdout).contains(mainPyOutput);
	});

	it("Set entry point -> Executes with entry point", () => {
		// Mark second.py as entry point
		cy.getBySelector(Select.fileExplorer.file).contains(secondPy.name).rightclick();
		cy.getBySelector(Select.fileExplorer.fileContextMenu.markAsEntryPoint).click();

		// Run button should contain second.py
		cy.getBySelector(Select.runCode).contains(secondPy.name).click();

		// Terminal should contain output from second.py
		cy.getBySelector(Select.terminal.stdout).contains(secondPyOutput);
	});

	it.only("No connection to API -> Displays error message in terminal", () => {
		const executeUrl = "**/api/v2/execute";
		const runtimesUrl = "**/api/v2/runtimes";

		cy.intercept("GET", runtimesUrl, {
			forceNetworkError: true
		}).as("runtimes");

		cy.intercept("POST", executeUrl, {
			forceNetworkError: true
		}).as("execute");

		cy.getBySelector(Select.fileExplorer.file).should("exist");
		cy.getBySelector(Select.runCode).click();
		cy.getBySelector(Select.terminal.stderr).should("contain.text", "error");
	});
});
