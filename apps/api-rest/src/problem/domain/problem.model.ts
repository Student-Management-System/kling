import { AggregateRoot } from "@nestjs/cqrs";
import { TestCaseDto } from "../../programming/dto/test-case.dto";
import { UserDto } from "../../user/dto/user.dto";
import { UserId } from "../../user/entities/user.entity";
import { Difficulty, ProblemDto, Status } from "../dto/problem/problem.dto";
import { ProblemId } from "../entities/problem-dao.entity";
import { ProblemCreatedEvent } from "../events/problem-created.event";

export class Problem extends AggregateRoot {
	id!: ProblemId;
	title!: string;
	categories!: string[];
	difficulty!: Difficulty;
	creationDate?: Date;
	creatorId!: UserId;
	creator?: UserDto;
	status?: Status;
	testCases?: TestCaseDto[];

	constructor(private dto: ProblemDto) {
		super();
		(this.id = dto.id), (this.title = dto.title);
		this.categories = dto.categories;
		this.difficulty = dto.difficulty;
		this.creationDate = dto.creationDate;
		this.creatorId = dto.creatorId;
		this.status = dto.status;
	}

	onCreate(): void {
		this.apply(new ProblemCreatedEvent(this));
	}
}
