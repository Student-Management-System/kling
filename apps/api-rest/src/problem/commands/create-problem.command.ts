import { Logger } from "@nestjs/common";
import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { createProblemFromCreateDto } from "../domain/problem.factory";
import { Problem } from "../domain/problem.model";
import { ProblemCreateDto } from "../dto/problem/create-problem.dto";
import { ProblemRepository } from "../repositories/problem.repository";

export class CreateProblemCommand {
	constructor(readonly problemDto: ProblemCreateDto, readonly creator: any) {}
}

@CommandHandler(CreateProblemCommand)
export class CreateProblemHandler implements ICommandHandler<CreateProblemCommand> {
	private logger = new Logger(CreateProblemHandler.name);

	constructor(private publisher: EventPublisher, private repository: ProblemRepository) {}

	async execute(command: CreateProblemCommand): Promise<Problem> {
		this.logger.verbose(`Executing command for ${command.problemDto.id}`);

		const problem = this.publisher.mergeObjectContext(
			createProblemFromCreateDto(command.problemDto, 1)
		);

		await this.repository.create(problem);
		problem.onCreate();

		problem.commit();
		return problem;
	}
}
