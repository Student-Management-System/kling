module.exports = {
	displayName: "client-data-access-state",
	preset: "../../../../jest.preset.js",
	setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts"],
	globals: {
		"ts-jest": {
			tsConfig: "<rootDir>/tsconfig.spec.json",
			stringifyContentPathRegex: "\\.(html|svg)$",
			astTransformers: {
				before: [
					"jest-preset-angular/build/InlineFilesTransformer",
					"jest-preset-angular/build/StripStylesTransformer"
				]
			}
		}
	},
	coverageDirectory: "../../../../coverage/libs/client/data-access/state",
	snapshotSerializers: [
		"jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js",
		"jest-preset-angular/build/AngularSnapshotSerializer.js",
		"jest-preset-angular/build/HTMLCommentSerializer.js"
	]
};
