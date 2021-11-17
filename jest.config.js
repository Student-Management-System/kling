/* eslint-disable no-undef */
module.exports = {
	globals: {
		"ts-jest": {
			isolatedModules: true
		}
	},
	projects: [
		"<rootDir>/apps/client",
		"<rootDir>/libs/client/data-access/state",
		"<rootDir>/libs/shared/util/programming",
		"<rootDir>/libs/client/data-access/indexed-db",
		"<rootDir>/libs/client/feature/file-tabs",
		"<rootDir>/libs/client/feature/get-started",
		"<rootDir>/libs/client/feature/ide-services",
		"<rootDir>/libs/client/feature/auth",
		"<rootDir>/libs/client/feature/shared",
		"<rootDir>/libs/client/feature/code-editor",
		"<rootDir>/libs/client/feature/ide-dialogs",
		"<rootDir>/libs/client/feature/ide",
		"<rootDir>/libs/client/feature/collaboration",
		"<rootDir>/libs/client/shared/components",
		"<rootDir>/libs/client/shared/services",
		"<rootDir>/libs/client/feature/exercise-submitter",
		"<rootDir>/libs/shared/storybook"
	],
	reporters:
		process.env.NODE_ENV === "CI" ? ["default", "jest-github-actions-reporter"] : ["default"]
};
