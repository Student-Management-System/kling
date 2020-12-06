import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SolutionDto } from "../../programming/dto/solution.dto";
import { SolutionStorageFacade } from "../solution-storage.facade";

@ApiBearerAuth()
@ApiTags("solutions")
@Controller("solutions")
export class SolutionController {
	constructor(private readonly solutionStorage: SolutionStorageFacade) {}

	@ApiOperation({
		operationId: "saveSolution",
		summary: "Save solution.",
		description: "Saves a new solution."
	})
	@Post()
	saveSolution(@Body() solution: SolutionDto): Promise<SolutionDto> {
		return this.solutionStorage.saveSolution(solution);
	}

	@ApiOperation({
		operationId: "getSolution",
		summary: "Get solution.",
		description: "Retrieves the solution with the given id."
	})
	@Get(":solutionId")
	getSolution(@Param("solutionId") solutionId: number): Promise<SolutionDto> {
		return this.solutionStorage.getSolution(solutionId);
	}

	@ApiOperation({
		operationId: "updateSolutions",
		summary: "",
		description: ""
	})
	@Patch("solutionId")
	updateSolutions(
		@Param("solutionId") solutionId: number,
		@Body() solution: SolutionDto
	): Promise<SolutionDto> {
		return this.solutionStorage.updateSolution(solutionId, solution);
	}

	@ApiOperation({
		operationId: "removeSolution",
		summary: "",
		description: ""
	})
	@Delete("solutionId")
	removeSolution(@Param("solutionId") solutionId: number): Promise<void> {
		return this.solutionStorage.removeSolution(solutionId);
	}
}
