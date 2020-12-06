import { PaginationFilter } from "../../../shared/pagination.filter";
import { sanitizeEnum, transformArray } from "../../../utils/http-utils";
import { Difficulty, Status } from "./problem.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class ProblemFilter extends PaginationFilter {
	@ApiPropertyOptional()
	title?: string;
	@ApiPropertyOptional({ enum: Difficulty, type: Difficulty, isArray: true })
	difficulties?: Difficulty[];
	@ApiPropertyOptional({ isArray: true, type: String })
	categories?: string[];
	@ApiPropertyOptional()
	status?: Status;

	constructor(filter?: Partial<ProblemFilter>) {
		super(filter);
		this.title = filter?.title;
		this.categories = transformArray(filter?.categories);
		this.difficulties = (sanitizeEnum(
			Difficulty,
			filter?.difficulties
		) as unknown) as Difficulty[];
	}
}
