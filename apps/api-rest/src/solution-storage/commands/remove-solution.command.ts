import { Logger } from "@nestjs/common";
import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { SolutionDto } from "../../programming/dto/solution.dto";
import { UserId } from "../../user/entities/user.entity";
import { createSolutionFromDto } from "../domain/solution.factory";
import { SolutionRepository } from "../repositories/solution.repository";

export class RemoveSolutionCommand {
	constructor(readonly solutionId: number) {}
}

@CommandHandler(RemoveSolutionCommand)
export class RemoveSolutionHandler implements ICommandHandler<RemoveSolutionCommand> {
	private logger = new Logger(RemoveSolutionHandler.name);

	constructor(private publisher: EventPublisher, private repository: SolutionRepository) {}

	async execute(command: RemoveSolutionCommand): Promise<SolutionDto> {
		this.logger.verbose(`Executing command for ${command.solutionId}.`);

		const solution = this.publisher.mergeObjectContext(
			(await this.repository.get(command.solutionId)) as any
		);

		await this.repository.create(solution);
		solution.onRem();

		solution.commit();
		return solution as any;
	}
}
