import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SolutionDao } from "../../programming/entities/solution.entity";
import { ToDto, toDto } from "../../shared/interfaces/to-dto.interface";
import { CodeTemplateDto } from "../dto/code-template.dto";
import { ProblemDao } from "./problem-dao.entity";

@Entity()
export class CodeTemplate implements ToDto<CodeTemplateDto> {
	@PrimaryGeneratedColumn()
	id!: number;

	@OneToOne(type => SolutionDao, { cascade: true })
	solution?: SolutionDao;

	@Column()
	solutionId!: number;

	@ManyToOne(type => ProblemDao)
	problem?: ProblemDao;

	@Column()
	problemId!: string;

	@Column()
	language!: string;

	constructor(partial: Partial<CodeTemplate>) {
		Object.assign(this, partial);
	}

	toDto(): CodeTemplateDto {
		return {
			id: this.id,
			problemId: this.problemId,
			solutionId: this.solutionId,
			solution: toDto(this.solution),
			language: this.language
		};
	}
}
