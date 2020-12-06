/**
 * Converts the given data to a JSON string and parses it again.
 * This will remove instances (i.e. of `new Date()`) and allows an easier comparison
 * of results in e2e tests.
 */
export function removeInstances<T>(data: T): T {
	return JSON.parse(JSON.stringify(data)) as T;
}
