import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SolutionDto } from "../../programming/dto/solution.dto";

export class SolutionRemoved {
	constructor(readonly solution: SolutionDto) {}
}

// @EventsHandler(SolutionRemoved)
// export class SolutionRemovedHandler implements IEventHandler<SolutionRemoved> {

// 	constructor() { }

// 	async handle(event: SolutionRemoved): Promise<void> {

// 	}

// }
