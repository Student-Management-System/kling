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
			colors: {
				"editor-bg": "var(--editor-background)",
				"section-header-bg": "var(--sidebar-header-bg)",
				"panel-bg": "var(--file-explorer-bg)",
				selected: "var(--text-selected)",
				light: "var(--text-light)",
				"vs-blue": "var(--vs-blue)"
			}
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
