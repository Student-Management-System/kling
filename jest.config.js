/* eslint-disable no-undef */
module.exports = {
	projects: [
		"<rootDir>/apps/client",
		"<rootDir>/apps/api-rest",
		"<rootDir>/apps/code-runner-service",
		"<rootDir>/libs/client/data-access/state",
		"<rootDir>/libs/shared/util/programming",
		"<rootDir>/libs/client/data-access/indexed-db",
		"<rootDir>/libs/client/ui/file-tabs"
	],
	reporters:
		process.env.NODE_ENV === "CI" ? ["default", "jest-github-actions-reporter"] : ["default"]
};
