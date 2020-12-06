import { TestCaseId } from "../entities/test-case.entity";

export class TestCaseDto {
	id!: TestCaseId;
	input!: any;
	expected!: any;
}
