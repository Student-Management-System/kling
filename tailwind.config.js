const { guessProductionMode } = require("@ngneat/tailwind");

process.env.TAILWIND_MODE = guessProductionMode() ? "build" : "watch";

module.exports = {
	mode: "jit",
	purge: {
		content: [
			"./apps/**/*.{html,scss}",
			"./libs/**/*.{html,scss}",
		]
	},
	darkMode: "class",
	theme: {
		extend: {
			text: {
				selected: "var(--text-selected)",
				light: "var(--text-light)"
			}
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
