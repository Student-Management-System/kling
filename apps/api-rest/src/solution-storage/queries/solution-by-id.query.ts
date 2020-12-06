import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SolutionDto } from "../../programming/dto/solution.dto";
import { SolutionRepository } from "../repositories/solution.repository";

export class SolutionByIdQuery {
	constructor(readonly solutionId: number) {}
}

@QueryHandler(SolutionByIdQuery)
export class SolutionByIdQueryHandler implements IQueryHandler {
	constructor(private readonly repository: SolutionRepository) {}

	execute(query: SolutionByIdQuery): Promise<SolutionDto> {
		throw new Error("Method not implemented.");
	}
}
