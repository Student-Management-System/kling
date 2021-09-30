module.exports = {
	displayName: "client-data-access-indexed-db",
	preset: "../../../../jest.preset.js",
	setupFiles: ["./jest.setup.ts"],
	globals: {
		"ts-jest": {
			tsconfig: "<rootDir>/tsconfig.spec.json"
		}
	},
	transform: {
		"^.+\\.[tj]sx?$": "ts-jest"
	},
	moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
	coverageDirectory: "../../../../coverage/libs/client/data-access/indexed-db"
};
