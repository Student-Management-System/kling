import { SolutionDto } from "../../programming/dto/solution.dto";
import { Solution } from "./solution.model";

/**
 * Creates a new solution from the given `solutionDto`.
 * @param solutionDto
 * @param owner `UserId` of the user that owns this solution.
 */
export function createSolutionFromDto(solutionDto: SolutionDto): Solution {
	const solution = new Solution({
		solutionDto
	});

	return solution;
}
