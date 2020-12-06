import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationFilter } from "../../shared/pagination.filter";

export class CategoryFilter extends PaginationFilter {
	@ApiPropertyOptional({ description: "Name of the category. Matched with ILIKE name%." })
	name?: string;

	constructor(filter?: Partial<CategoryFilter>) {
		super(filter);
		this.name = filter?.name;
	}
}
