import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SolutionDto } from "../../programming/dto/solution.dto";

export class SolutionCreated {
	constructor(readonly solution: SolutionDto) {}
}

// @EventsHandler(SolutionCreated)
// export class SolutionCreatedHandler implements IEventHandler<SolutionCreated> {

// 	constructor() { }

// 	async handle(event: SolutionCreated): Promise<void> {

// 	}

// }
