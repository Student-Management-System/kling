module.exports = {
	displayName: "client-feature-collaboration",
	preset: "../../../../jest.preset.js",
	setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts"],
	globals: {
		"ts-jest": {
			tsconfig: "<rootDir>/tsconfig.spec.json",
			stringifyContentPathRegex: "\\.(html|svg)$"
		}
	},
	coverageDirectory: "../../../../coverage/libs/client/feature/collaboration",
	transform: {
		"^.+\\.(ts|js|html)$": "jest-preset-angular"
	},
	snapshotSerializers: [
		"jest-preset-angular/build/serializers/no-ng-attributes",
		"jest-preset-angular/build/serializers/ng-snapshot",
		"jest-preset-angular/build/serializers/html-comment"
	]
};
