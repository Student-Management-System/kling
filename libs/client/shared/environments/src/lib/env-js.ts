type Env = {
	STUDENT_MGMT_BASE_PATH: string;
	AUTH_BASE_PATH: string;
	PISTON_CODE_EXECUTION_BASE_PATH: string;
	CONVERGENCE_REALTIME_API_PATH: string;
};

export function getEnv(): Env | undefined {
	return (window as any).__env;
}

/**
 * Returns the value of environment variables defined on the `window.__env` object (see env.js).
 *
 * @param key Name of the environment variable.
 * @returns Value of the variable or throws an error, if it is `undefined`.
 */
export function getEnvVariableOrThrow<K extends keyof Env>(key: K): Env[K] | never {
	const env = getEnv();

	if (!env) {
		throw new Error("Environment is undefined (env.js is missing).");
	}

	const value = env[key];
	if (value === undefined) {
		throw new Error("Environment variable from env.js was undefined: " + key);
	}

	return value;
}
