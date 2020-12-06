import { SubmissionDto } from "../../../programming/dto/submission.dto";
import { TestCaseDto } from "../../../programming/dto/test-case.dto";
import { UserDto } from "../../../user/dto/user.dto";
import { UserId } from "../../../user/entities/user.entity";
import { CodeTemplateDto } from "../code-template.dto";

export enum Difficulty {
	EASY = "EASY",
	MEDIUM = "MEDIUM",
	HARD = "HARD"
}

export enum Status {
	ATTEMPTED = "ATTEMPTED",
	SOLVED = "SOLVED",
	UNSOLVED = "UNSOLVED"
}

export class ProblemDto {
	/** Unique Id of this problem. */
	id!: string;
	/** Title of this problem. */
	title!: string;
	/** Categories of this problem. */
	categories!: string[];
	/** The difficulty of this problem. */
	difficulty!: Difficulty;
	creationDate?: Date;
	creatorId!: UserId;
	creator?: UserDto;
	status?: Status;
	submissions?: SubmissionDto[];
	/** Contains code templates that should be modified/extended by students. */
	codeTemplates?: CodeTemplateDto[];
	testCases?: TestCaseDto[];
}
