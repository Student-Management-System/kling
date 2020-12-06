import { BadRequestException, Injectable, NotImplementedException } from "@nestjs/common";
import { toDtos } from "../../shared/interfaces/to-dto.interface";
import { ProblemCreateDto } from "../dto/problem/create-problem.dto";
import { ProblemFilter } from "../dto/problem/problem-filter";
import { ProblemDto } from "../dto/problem/problem.dto";
import { ProblemId } from "../entities/problem-dao.entity";
import { ProblemRepository } from "../repositories/problem.repository";
import { UserDto } from "../../user/dto/user.dto";
import { CommandBus } from "@nestjs/cqrs";
import { CreateProblemCommand } from "../commands/create-problem.command";

@Injectable()
export class ProblemService {
	constructor(private repo: ProblemRepository, private commandBus: CommandBus) {}

	async createProblem(problem: ProblemCreateDto, user: UserDto): Promise<ProblemDto> {
		await this.commandBus.execute(new CreateProblemCommand(problem, user));
		return this.getProblem(problem.id);
	}

	async getProblem(problemId: ProblemId): Promise<ProblemDto> {
		return (await this.repo.get(problemId)).toDto();
	}

	async findProblems(filter?: ProblemFilter): Promise<[ProblemDto[], number]> {
		const [problems, count] = await this.repo.find(filter);
		return [toDtos(problems) ?? [], count];
	}

	async updateProblem(problemId: ProblemId, update: Partial<ProblemDto>): Promise<ProblemDto> {
		throw new NotImplementedException();
	}

	async removeProblem(problemId: ProblemId): Promise<void> {
		const deleted = await this.repo.delete(problemId);
		if (!deleted) {
			throw new BadRequestException(`Failed to delete problem '${problemId}'.`);
		}
	}
}
