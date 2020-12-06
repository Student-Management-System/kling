import { Logger } from "@nestjs/common";
import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { SolutionDto } from "../../programming/dto/solution.dto";
import { UserId } from "../../user/entities/user.entity";
import { createSolutionFromDto } from "../domain/solution.factory";
import { SolutionRepository } from "../repositories/solution.repository";

export class SaveSolutionCommand {
	constructor(readonly solutionDto: SolutionDto, readonly userId: UserId) {}
}

@CommandHandler(SaveSolutionCommand)
export class CreateProblemHandler implements ICommandHandler<SaveSolutionCommand> {
	private logger = new Logger(CreateProblemHandler.name);

	constructor(private publisher: EventPublisher, private repository: SolutionRepository) {}

	async execute(command: SaveSolutionCommand): Promise<SolutionDto> {
		this.logger.verbose(
			`Executing command for ${command.solutionDto.name} of user ${command.userId}.`
		);

		command.solutionDto.userId = command.userId;

		const solution = this.publisher.mergeObjectContext(
			createSolutionFromDto(command.solutionDto)
		);

		await this.repository.create(solution);
		solution.onCreate();

		solution.commit();
		return (solution as any) as SolutionDto;
	}
}
