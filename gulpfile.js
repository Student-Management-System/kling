const gulp = require("gulp");
const svgstore = require("gulp-svgstore");
const svgmin = require("gulp-svgmin");
const rename = require("gulp-rename");
const run = require("gulp-run-command").default;

// Combines all .svg-icons to a single file
gulp.task("svg-sprite", () => {
	return gulp
		.src("apps/client/src/assets/icons/svg/*.svg")
		.pipe(
			svgmin(() => {
				return {
					plugins: [
						{
							removeViewBox: false,
						},
						{
							removeDimensions: true,
						},
					],
				};
			})
		)
		.pipe(svgstore())
		.pipe(rename({ basename: "sprites" }))
		.pipe(gulp.dest("apps/client/src/assets/icons"));
});