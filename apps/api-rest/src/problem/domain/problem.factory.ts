import { UserId } from "../../user/entities/user.entity";
import { ProblemCreateDto } from "../dto/problem/create-problem.dto";
import { ProblemDto } from "../dto/problem/problem.dto";
import { Problem } from "./problem.model";

export function createProblemFromDto(dto: ProblemDto): Problem {
	return new Problem(dto);
}

export function createProblemFromCreateDto(dto: ProblemCreateDto, creatorId: UserId): Problem {
	const fullDto: ProblemDto = {
		...dto,
		creatorId
	};
	return new Problem(fullDto);
}
