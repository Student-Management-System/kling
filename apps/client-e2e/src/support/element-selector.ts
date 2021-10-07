export const Select = {
	sidebar: {
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
		}
	},
	button: {
		create: "createBtn",
		confirm: "confirmBtn",
		cancel: "cancelBtn"
	}
} as const;
