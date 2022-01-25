/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
	content: ["./apps/client/**/*.html", "./libs/**/*.html"],
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
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
};
