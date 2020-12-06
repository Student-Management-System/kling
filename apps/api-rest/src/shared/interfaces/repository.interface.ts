export interface IRepository<T> {
	create(...params: unknown[]): Promise<T>;
	get(...params: unknown[]): Promise<T>;
	getPure?(...params: unknown[]): Promise<T>;
	tryGet(...params: unknown[]): Promise<T | undefined>;
	find(...params: unknown[]): Promise<[T[], number]>;
	update?(...params: unknown[]): Promise<T>;
	delete(...params: unknown[]): Promise<boolean>;
}
