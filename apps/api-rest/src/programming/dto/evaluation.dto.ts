import { FailedTestCase } from "../entities/test-case-result.entity";

export enum EvaluationResult {
	ACCEPTED = "ACCEPTED",
	COMPILE_ERROR = "COMPILE_ERROR",
	FAILED_TESTS = "FAILED_TESTS"
}

export class EvaluationDto {
	id!: number;
	result!: EvaluationResult;
	speedInMs?: number;
	memoryUsedInKb?: number;
	failedTests?: FailedTestCase[];
}
