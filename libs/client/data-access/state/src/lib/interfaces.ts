export interface MetaState {
	isLoading: boolean;
	hasLoaded: boolean;
	error?: unknown;
}

export type Loadable<T> = {
	data: T;
	isLoading: boolean;
};

export function setLoadable<T>(data: T, isLoading = false): Loadable<T> {
	return { data, isLoading };
}
