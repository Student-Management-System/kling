import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SolutionDto } from "../../programming/dto/solution.dto";

export class SolutionUpdated {
	constructor(readonly solution: SolutionDto) {}
}

@EventsHandler(SolutionUpdated)
export class SolutionUpdatedHandler implements IEventHandler<SolutionUpdated> {
	constructor() {}

	async handle(event: SolutionUpdated): Promise<void> {}
}
