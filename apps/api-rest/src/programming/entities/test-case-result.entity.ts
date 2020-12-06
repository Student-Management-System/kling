import { PrimaryGeneratedColumn, ManyToOne, Column, Entity } from "typeorm";
import { TestCase, TestCaseId } from "./test-case.entity";
import { Evaluation } from "./evaluation.entity";
import { ToDto } from "../../shared/interfaces/to-dto.interface";
import { FailedTestCaseDto } from "../dto/failed-test-case.dto";

@Entity()
export class FailedTestCase implements ToDto<FailedTestCaseDto> {
	@PrimaryGeneratedColumn()
	id!: number;

	@ManyToOne(type => TestCase)
	testCase?: TestCase;

	@Column()
	testCaseId!: TestCaseId;

	@Column({ type: "json" })
	actual?: any;

	@ManyToOne(type => Evaluation, evaluation => evaluation.failedTests)
	evaluation?: Evaluation;

	toDto(): FailedTestCaseDto {
		return {
			testCaseId: this.testCaseId,
			actual: this.actual
		};
	}
}
