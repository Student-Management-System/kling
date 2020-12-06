import { AggregateRoot } from "@nestjs/cqrs";
import { SolutionDto } from "../../programming/dto/solution.dto";
import { SolutionCreated, SolutionUpdated, SolutionRemoved } from "../events";

export class Solution extends AggregateRoot {
	readonly solutionDto: SolutionDto;

	constructor(partial: Partial<Solution>) {
		super();
		Object.assign(this, partial);
	}

	onCreate(): void {
		this.apply(new SolutionCreated(this.solutionDto));
	}

	onUpdated(): void {
		this.apply(new SolutionUpdated(this.solutionDto));
	}

	onRemove(): void {
		this.apply(new SolutionRemoved(this.solutionDto));
	}
}
