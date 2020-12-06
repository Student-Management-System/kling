describe("/problems/example-problem (workspace)", () => {
	const selectedFile = "running-sum.ts";
	const otherFile = "helper-methods.ts";
	const directory = "animals";

	const getFileExplorer = () => cy.get(".file-explorer");
	const getFileTabs = () => cy.get(".file-tabs");

	const getSelectedFileFromFileExplorer = () => getFileExplorer().contains(selectedFile);
	const getOtherFileFromFileExplorer = () => getFileExplorer().contains(otherFile);
	const getDirectoryFromFileExplorer = () =>
		getFileExplorer().get(".directory > button").contains(directory);

	beforeEach(() => {
		cy.visit("/problems/example-problem");
	});

	describe("Activity-Bar", () => {
		it("Displays the activity bar", () => {
			cy.get(".activity-bar-container");
		});

		it("Selects explorer tab", () => {
			cy.get(".activity-bar-container").get(".tab.selected").contains("file_copy");
		});
	});

	describe("File-Explorer", () => {
		it("Displays the file explorer", () => {
			getFileExplorer();
		});

		it("Add file button -> Opens Create-File-Dialog -> Enter filename -> Adds file", () => {
			getFileExplorer().get(".add-file-btn").click();

			const newFileName = "a-new-file.ts";
			cy.get("app-create-file").type(newFileName);
			cy.get("app-create-file").get("button").contains("Create").click();

			getFileExplorer().contains(newFileName);
		});

		it("Add directory button -> Opens Create-Directory-Dialog -> Enter directory name -> Adds directory", () => {
			getFileExplorer().get(".add-file-btn").click();

			const newDirectoryName = "new-directory";
			cy.get("app-create-file").type(newDirectoryName);
			cy.get("app-create-file").get("button").contains("Create").click();

			getFileExplorer().contains(newDirectoryName);
		});

		describe("Files", () => {
			it("Selects first file", () => {
				getFileExplorer().get(".file .selected").contains(selectedFile);
			});

			it("Selects different file on click", () => {
				getFileExplorer().contains(otherFile).click();
				getFileExplorer().get(".file .selected").contains(otherFile);
				getFileTabs().get(".file-tab .selected").contains(otherFile);
			});

			describe("Context-Menu", () => {
				it("Rightclick opens Context-Menu", () => {
					getFileExplorer().contains(otherFile).rightclick();
					cy.get(".context-menu");
				});

				it("Delete -> Opens Confirm-Dialog -> Confirm -> Deletes file", () => {
					getFileExplorer().contains(selectedFile).rightclick();
					cy.get(".context-menu").get(".context-menu-item").contains("Delete").click();
					cy.get("app-confirm-dialog").get("button").contains("Confirm").click();
					getFileExplorer().should("not.contain", selectedFile);
					getFileTabs().should("not.contain", selectedFile);
				});
			});
		});

		describe("Directories", () => {
			it("Collapses on click", () => {
				const dir = getFileExplorer().find(".directory").contains(directory);
				dir.click();
				dir.children().should("be.empty");
			});

			describe("Context-Menu", () => {
				const openContextMenu = () =>
					getFileExplorer().get(".directory > button").contains(directory).rightclick();

				it("Rightclick opens Context-Menu", () => {
					openContextMenu();
					cy.get(".context-menu");
				});

				it("Add file -> Opens Create-File-Dialog -> Enter filename -> Adds file", () => {
					cy.visit("/problems/example-problem"); // Navigate to workspace component (IDE)

					// Find directory called "animals" and rightlick it
					cy.get(".file-explorer")
						.find(".directory")
						.contains("animals")
						.as("targetDirectory") // Create alias
						.rightclick();

					// Find "Add file" button inside the context menu and click it
					cy.get(".context-menu-item").contains("Add file").click();

					cy.get("app-create-file") // Get create-file dialog
						.type("a-new-file.ts") // Type name of new file
						.find("button")
						.contains("Create")
						.click(); // Click "Create" button

					cy.get("@targetDirectory")
						.parent() // Use alias
						.contains("a-new-file.ts") // Should contain new file
						.should("have.class", "selected"); // Css class should be "selected"

					cy.get(".file-tabs")
						.find(".file-tab")
						.contains("a-new-file.ts") // New file should have a file tab
						.should("have.class", "selected"); // Css class should be "selected"
				});

				it("Delete -> Opens Confirm-Dialog -> Confirm -> Deletes file", () => {
					openContextMenu();
					cy.get(".context-menu").get(".context-menu-item").contains("Delete").click();
					cy.get("app-confirm-dialog").get("button").contains("Confirm").click();
					getFileExplorer().should("not.contain", directory);
				});
			});
		});
	});

	describe("File-Tabs", () => {
		it("Displays selected file", () => {
			getFileTabs().get(".selected").contains(selectedFile);
		});

		it("Adds additional tab", () => {
			getFileExplorer().contains(otherFile).click();
			getFileTabs().children(".file-tab").should("have.length", 2);

			// Previously opened/selected tab is still present
			getFileTabs().children(".file-tab").contains(selectedFile);

			getFileTabs().children(".file-tab").contains(otherFile);

			// Other file should now be selected
			getFileTabs().get(".file-tab .selected").contains(otherFile);
		});

		it("Switches selected tab on click", () => {
			getFileExplorer().contains(otherFile).click();
			getFileTabs().children(".file-tab").should("have.length", 2);

			// otherFile should be selected now
			getFileTabs().get(".file-tab .selected").contains(otherFile);

			// Select the other tab (selectedFile)
			getFileTabs().get(".file-tab").contains(selectedFile).click();
			getFileTabs().get(".file-tab .selected").contains(selectedFile);
		});

		it("Closes tab when close-button is clicked", () => {
			getFileExplorer().contains(otherFile).click();
			getFileTabs().children(".file-tab").should("have.length", 2);

			getFileTabs().children(".file-tab").get(".clear-btn:first").click();
			getFileTabs().children(".file-tab").should("have.length", 1);
		});
	});

	describe("Editor", () => {
		it("Displays the monaco-editor", () => {
			cy.get(".monaco-editor");
		});
	});
});
