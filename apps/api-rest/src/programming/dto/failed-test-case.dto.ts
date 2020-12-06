import { TestCaseId } from "../entities/test-case.entity";

export class FailedTestCaseDto {
	testCaseId!: TestCaseId;
	actual?: any;
}
