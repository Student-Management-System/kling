module.exports = {
	displayName: "client-data-access-state",
	preset: "../../../../jest.preset.js",
	setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts"],
	globals: {
		"ts-jest": {
			stringifyContentPathRegex: "\\.(html|svg)$",
			astTransformers: {
				before: [
					"jest-preset-angular/build/InlineFilesTransformer",
					"jest-preset-angular/build/StripStylesTransformer"
				]
			},
			tsconfig: "<rootDir>/tsconfig.spec.json"
		}
	},
	coverageDirectory: "../../../../coverage/libs/client/data-access/state",
	snapshotSerializers: [
		"jest-preset-angular/build/serializers/no-ng-attributes",
		"jest-preset-angular/build/serializers/ng-snapshot",
		"jest-preset-angular/build/serializers/html-comment"
	]
};
