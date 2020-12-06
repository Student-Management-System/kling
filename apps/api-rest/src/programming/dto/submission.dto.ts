import { UserDto } from "../../user/dto/user.dto";
import { UserId } from "../../user/entities/user.entity";
import { SubmissionId } from "../entities/submission.entity";
import { EvaluationDto } from "./evaluation.dto";
import { SolutionDto } from "./solution.dto";

export class SubmissionDto {
	id!: SubmissionId;
	problemId!: string;
	userId!: UserId;
	user?: UserDto;
	solution?: SolutionDto;
	tags?: string[];
	evaluation?: EvaluationDto;
}
