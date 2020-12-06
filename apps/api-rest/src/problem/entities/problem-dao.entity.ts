import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryColumn
} from "typeorm";
import { Submission } from "../../programming/entities/submission.entity";
import { TestCase } from "../../programming/entities/test-case.entity";
import { ToDto, toDto, toDtos } from "../../shared/interfaces/to-dto.interface";
import { User, UserId } from "../../user/entities/user.entity";
import { Difficulty, ProblemDto } from "../dto/problem/problem.dto";
import { Category } from "./category.entity";
import { CodeTemplate } from "./code-template.entity";

export type ProblemId = string;

@Entity()
export class ProblemDao implements ToDto<ProblemDto> {
	@PrimaryColumn()
	id!: ProblemId;

	@Column()
	title!: string;

	@Column({ type: "enum", enum: Difficulty, default: Difficulty.EASY })
	difficulty!: Difficulty;

	@OneToMany(type => CodeTemplate, codeTemplate => codeTemplate.problem)
	codeTemplates?: CodeTemplate[];

	@OneToMany(type => TestCase, testCase => testCase.problem)
	testCases?: TestCase[];

	@OneToMany(type => Submission, submission => submission.problem)
	submissions?: Submission[];

	@ManyToMany(type => Category, { cascade: true, onDelete: "CASCADE" })
	@JoinTable()
	categories!: Category[];

	@ManyToOne(type => User)
	creator?: User;

	@Column()
	creatorId!: UserId;

	@CreateDateColumn()
	creationDate!: Date;

	constructor(partial?: Partial<ProblemDao>) {
		Object.assign(this, partial);
	}

	toDto(): ProblemDto {
		return {
			id: this.id,
			title: this.title,
			difficulty: this.difficulty,
			categories: this.categories?.map(c => c.name),
			creatorId: this.creatorId,
			creationDate: this.creationDate,
			creator: toDto(this.creator),
			submissions: toDtos(this.submissions),
			codeTemplates: toDtos(this.codeTemplates)
		};
	}
}
