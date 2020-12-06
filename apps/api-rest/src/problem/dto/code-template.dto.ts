import { SolutionDto } from "../../programming/dto/solution.dto";

export class CodeTemplateDto {
	id!: number;
	problemId!: string;
	solutionId!: number;
	solution?: SolutionDto;
	language!: string;
}
