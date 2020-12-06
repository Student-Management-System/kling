export class ProblemId {
	readonly type = "ProblemId";

	private constructor(readonly value: string) {}

	static create(id: string): ProblemId {
		return new ProblemId(id);
	}
}
