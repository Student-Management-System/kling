export const Select = {
	sidebar: {
		explorer: {
			projectName: "projectName"
		},
		explorerMenu: {
			button: "explorer-menu-btn",
			saveAsNewProject: "save-as-new-project-btn"
		}
	},
	fileExplorer: {
		button: {
			addFile: "add-file-btn",
			addDirectory: "add-directory-btn"
		},
		file: "file",
		fileContextMenu: {
			markAsEntryPoint: "markAsEntryPointBtn",
			delete: "deleteBtn"
		},
		directory: "directory",
		directoryContextMenu: {
			addFile: "addFileBtn",
			addDirectory: "addDirectoryBtn",
			delete: "deleteBtn"
		}
	},
	fileTabs: {
		tab: "file-tab",
		unsavedChangesIndicator: "fileTab_unsavedChangesIndicator"
	},
	file: {
		unsavedChangesIndicator: "unsavedChangesIndicator"
	},
	terminal: {
		stdout: "stdout",
		stderr: "stderr",
		stdin: "stdin"
	},
	runCode: "runCodeBtn",
	dialog: {
		createProject: {
			container: "create-project-dialog",
			projectNameInput: "project-name-input"
		},
		createFile: {
			container: "create-file-dialog",
			fileNameInput: "file-name-input"
		},
		createDirectory: {
			container: "create-directory-dialog",
			directoryNameInput: "directoryNameInput"
		},
		confirm: {
			container: "confirm-dialog"
		},
		login: {
			container: "loginDialog",
			usernameInput: "usernameInput",
			passwordInput: "passwordInput",
			errorMessage: "errorMessage",
			loadingSpinner: "loadingSpinner",
			loginBtn: "loginBtn"
		}
	},
	button: {
		create: "createBtn",
		confirm: "confirmBtn",
		cancel: "cancelBtn",
		submit: "submitBtn"
	},
	openLoginButton: "openLoginBtn",
	getStarted: {
		userGreeting: "userGreeting"
	},
	exerciseSubmitter: {
		title: "exerciseSubmitterTitle",
		coursesBreadcrumb: "coursesBreadcrumb",
		course: "course",
		courseBreadcrumb: "courseBreadcrumb",
		assignment: "assignment",
		assignmentBreadcrumb: "assignmentBreadcrumb",
		submitBtn: "submitBtn"
	},
	assignment: {
		endDate: "assignmentEndDate",
		group: "assignmentGroup"
	}
} as const;
