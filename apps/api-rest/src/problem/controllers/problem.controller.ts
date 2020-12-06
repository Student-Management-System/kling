import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Put,
	Query,
	Req,
	UseGuards
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Request } from "express";
import { PaginatedResult } from "../../utils/http-utils";
import { ProblemFilter } from "../dto/problem/problem-filter";
import { ProblemDto } from "../dto/problem/problem.dto";
import { ProblemId } from "../entities/problem-dao.entity";
import { ProblemService } from "../services/problem.service";
import { ProblemCreateDto } from "../dto/problem/create-problem.dto";
import { AuthGuard } from "@nestjs/passport";
import { CreateProblemPermission } from "../guards/create-problem-permission.guard";
import { UserDto } from "../../user/dto/user.dto";

@ApiTags("problem")
@Controller("problems")
export class ProblemController {
	constructor(private problemService: ProblemService) {}

	@Put(":problemId")
	@UseGuards()
	@ApiOperation({
		operationId: "createProblem",
		summary: "Create problem.",
		description: "Creates a new problem."
	})
	async createProblem(
		@Param("problemId") problemId: ProblemId,
		@Body() problem: ProblemCreateDto,
		user: UserDto
	): Promise<ProblemDto> {
		return this.problemService.createProblem(problem, user);
	}

	@Get(":problemId")
	@ApiResponse({ status: 404, description: "Problem does not exist." })
	@ApiOperation({
		operationId: "getProblem",
		summary: "Get problem.",
		description:
			"Retrieves the problem with the specified Id. Throws error, if problem does not exist."
	})
	async getProblem(@Param("problemId") problemId: ProblemId): Promise<ProblemDto> {
		return this.problemService.getProblem(problemId);
	}

	@Get()
	@ApiOperation({
		operationId: "findProblems",
		summary: "Find problems.",
		description: "Retrieves all problems that match the the specified filter."
	})
	async findProblems(
		@Req() request: Request,
		@Query() filter?: ProblemFilter
	): Promise<ProblemDto[]> {
		return PaginatedResult(
			this.problemService.findProblems(new ProblemFilter(filter)),
			request
		);
	}

	@Patch(":problemId")
	@ApiOperation({
		operationId: "updateProblem",
		summary: "Update problem.",
		description: "Updates the problem partially."
	})
	async updateProblem(
		@Param("problemId") problemId: ProblemId,
		@Body() update: ProblemDto
	): Promise<ProblemDto> {
		return this.problemService.updateProblem(problemId, update);
	}

	@Delete(":problemId")
	@ApiOperation({
		operationId: "removeProblem",
		summary: "Remove problem.",
		description:
			"Removes the problem and all its related data (i.e. submissions, code templates, etc.)"
	})
	async removeProblem(@Param("problemId") problemId: ProblemId): Promise<void> {
		return this.problemService.removeProblem(problemId);
	}
}
