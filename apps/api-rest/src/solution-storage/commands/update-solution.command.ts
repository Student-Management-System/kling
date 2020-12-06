import { Logger } from "@nestjs/common";
import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { SolutionDto } from "../../programming/dto/solution.dto";
import { UserId } from "../../user/entities/user.entity";
import { createSolutionFromDto } from "../domain/solution.factory";
import { SolutionRepository } from "../repositories/solution.repository";

export class UpdateSolutionCommand {
	constructor(readonly solutionDto: SolutionDto) {}
}

@CommandHandler(UpdateSolutionCommand)
export class UpdateSolutionHandler implements ICommandHandler<UpdateSolutionCommand> {
	private logger = new Logger(UpdateSolutionHandler.name);

	constructor(private publisher: EventPublisher, private repository: SolutionRepository) {}

	async execute(command: UpdateSolutionCommand): Promise<SolutionDto> {
		this.logger.verbose(
			`Executing command for ${command.solutionDto.name} of user ${command.solutionDto.userId}.`
		);

		const solution = this.publisher.mergeObjectContext(
			createSolutionFromDto(command.solutionDto)
		);

		await this.repository.create(solution);
		solution.onCreate();

		solution.commit();
		return solution as any;
	}
}
