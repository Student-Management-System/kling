// eslint-disable-next-line no-undef
module.exports = {
	displayName: "api-rest",
	preset: "../../jest.preset.js",
	globals: {
		"ts-jest": {
			tsConfig: "<rootDir>/tsconfig.spec.json"
		}
	},
	transform: {
		"^.+\\.[tj]s$": "ts-jest"
	},
	moduleFileExtensions: ["ts", "js", "html"],
	coverageDirectory: "../../coverage/apps/api-rest"
};
