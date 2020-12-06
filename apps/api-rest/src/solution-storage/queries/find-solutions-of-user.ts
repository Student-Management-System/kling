import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SolutionDto } from "../../programming/dto/solution.dto";
import { PaginatedResult } from "../../shared/types";
import { UserId } from "../../user/entities/user.entity";
import { SolutionRepository } from "../repositories/solution.repository";

export class FindSolutionsOfUserQuery {
	constructor(readonly userId: UserId) {}
}

@QueryHandler(FindSolutionsOfUserQuery)
export class FindSolutionsOfUserQueryHandler implements IQueryHandler {
	constructor(private readonly repository: SolutionRepository) {}

	execute(query: FindSolutionsOfUserQuery): Promise<PaginatedResult<SolutionDto>> {
		return null;
	}
}
