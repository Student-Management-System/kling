// https://github.com/nrwl/nx/issues/2147#issuecomment-707842322
module.exports = (config, _context) => {
	const tsLoader = config.module.rules.find(r => r.loader.includes("ts-loader"));

	if (tsLoader) {
		tsLoader.options.transpileOnly = false;
		tsLoader.options.getCustomTransformers = program => {
			return {
				before: [
					require("@nestjs/swagger/plugin").before(
						{
							// Options: typeFileNameSuffix, introspectComments
						},
						program
					)
				]
			};
		};
	}

	return config;
};
