import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ProblemDao, ProblemId } from "../../problem/entities/problem-dao.entity";
import { ToDto } from "../../shared/interfaces/to-dto.interface";
import { TestCaseDto } from "../dto/test-case.dto";

export type TestCaseId = number;

@Entity()
export class TestCase implements ToDto<TestCaseDto> {
	@PrimaryGeneratedColumn()
	id!: TestCaseId;

	@ManyToOne(type => ProblemDao, problem => problem.testCases)
	problem?: ProblemDao;

	@Column()
	problemId!: ProblemId;

	@Column({ type: "json" })
	input!: any;

	@Column({ type: "json" })
	expected?: any;

	constructor(partial: Partial<TestCase>) {
		Object.assign(this, partial);
	}

	toDto(): TestCaseDto {
		return {
			id: this.id,
			input: this.input,
			expected: this.expected
		};
	}
}
