/* eslint-disable no-undef */
module.exports = {
	projects: [
		"<rootDir>/apps/client",
		"<rootDir>/apps/api-rest",
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
		"<rootDir>/libs/client/feature/ide"
	],
	reporters:
		process.env.NODE_ENV === "CI" ? ["default", "jest-github-actions-reporter"] : ["default"]
};
