const { guessProductionMode } = require("@ngneat/tailwind");

process.env.TAILWIND_MODE = guessProductionMode() ? "build" : "watch";

module.exports = {
	prefix: "",
	mode: "jit",
	purge: {
		content: [
			"./apps/**/*.{html,scss}",
			"./libs/**/*.{html,scss}",
		]
	},
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};