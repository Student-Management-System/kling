import { ToDto } from "../../shared/interfaces/to-dto.interface";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from "typeorm";
import { EvaluationDto, EvaluationResult } from "../dto/evaluation.dto";
import { Submission } from "./submission.entity";
import { FailedTestCase } from "./test-case-result.entity";

@Entity()
export class Evaluation implements ToDto<EvaluationDto> {
	@PrimaryGeneratedColumn()
	id!: number;

	@OneToOne(type => Submission)
	submission?: Submission;

	@Column({ type: "enum", enum: EvaluationResult })
	result!: EvaluationResult;

	@Column({ nullable: true })
	speedInMs?: number;

	@Column({ nullable: true })
	memoryUsedInKb?: number;

	@OneToMany(type => FailedTestCase, failedTestCase => failedTestCase.evaluation)
	failedTests?: FailedTestCase[];

	constructor(partial: Partial<Evaluation>) {
		Object.assign(this, partial);
	}

	toDto(): EvaluationDto {
		return {
			id: this.id,
			result: this.result,
			speedInMs: this.speedInMs,
			memoryUsedInKb: this.memoryUsedInKb,
			failedTests: this.failedTests
		};
	}
}
