import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { SolutionDto } from "../programming/dto/solution.dto";
import { RemoveSolutionCommand, SaveSolutionCommand, UpdateSolutionCommand } from "./commands";
import { SolutionByIdQuery } from "./queries/solution-by-id.query";

@Injectable()
export class SolutionStorageFacade {
	constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

	async saveSolution(solution: SolutionDto): Promise<SolutionDto> {
		const savedSolution: SolutionDto = await this.commandBus.execute(
			new SaveSolutionCommand(solution, solution.userId)
		);

		return this.queryBus.execute(new SolutionByIdQuery(savedSolution.id));
	}

	async getSolution(id: number): Promise<SolutionDto> {
		return this.queryBus.execute(new SolutionByIdQuery(id));
	}

	async updateSolution(id: number, solution: SolutionDto): Promise<SolutionDto> {
		solution.id = id;

		const savedSolution: SolutionDto = await this.commandBus.execute(
			new UpdateSolutionCommand(solution)
		);

		return this.queryBus.execute(new SolutionByIdQuery(solution.id));
	}

	async removeSolution(id: number): Promise<void> {
		return this.commandBus.execute(new RemoveSolutionCommand(id));
	}
}
