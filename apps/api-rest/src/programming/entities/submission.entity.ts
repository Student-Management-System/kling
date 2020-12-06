import {
	ManyToOne,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn,
	Entity,
	ManyToMany,
	JoinTable
} from "typeorm";
import { ProblemDao } from "../../problem/entities/problem-dao.entity";
import { SubmissionDto } from "../dto/submission.dto";
import { User } from "../../user/entities/user.entity";
import { SolutionDao } from "./solution.entity";
import { ToDto, toDto } from "../../shared/interfaces/to-dto.interface";
import { Evaluation } from "./evaluation.entity";
import { SubmissionTag } from "./submission-tag.entity";

export type SubmissionId = number;

@Entity()
export class Submission implements ToDto<SubmissionDto> {
	@PrimaryGeneratedColumn()
	id!: SubmissionId;

	@ManyToOne(type => ProblemDao, problem => problem.submissions, { onDelete: "CASCADE" })
	problem!: ProblemDao;

	@Column()
	problemId!: string;

	@ManyToOne(type => User, user => user.submissions)
	user?: User;

	@Column()
	userId!: number;

	@OneToOne(type => SolutionDao, { cascade: ["insert"] })
	@JoinColumn()
	solution?: SolutionDao;

	@Column()
	solutionId!: number;

	@OneToOne(type => Evaluation, { cascade: ["insert"] })
	@JoinColumn()
	evaluation?: Evaluation;

	@Column()
	evaluationId!: number;

	@ManyToMany(type => SubmissionTag, { cascade: ["insert"] })
	@JoinTable()
	tags?: SubmissionTag[];

	constructor(partial?: Partial<Submission>) {
		Object.assign(this, partial);
	}

	toDto(): SubmissionDto {
		return {
			id: this.id,
			problemId: this.problemId,
			userId: this.userId,
			user: toDto(this.user),
			solution: toDto(this.solution),
			evaluation: toDto(this.evaluation),
			tags: this.tags?.map(tag => tag.name)
		};
	}
}
