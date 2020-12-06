import { Logger } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Problem } from "../domain/problem.model";

export class ProblemCreatedEvent {
	constructor(public readonly problem: Problem) {}
}

@EventsHandler(ProblemCreatedEvent)
export class ProblemCreatedHandler implements IEventHandler<ProblemCreatedEvent> {
	private logger = new Logger(ProblemCreatedHandler.name);

	constructor() {}

	async handle(event: ProblemCreatedEvent): Promise<void> {
		this.logger.verbose("Invoked");
	}
}
