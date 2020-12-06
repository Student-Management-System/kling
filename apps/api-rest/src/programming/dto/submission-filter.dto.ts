import { PaginationFilter } from "../../shared/pagination.filter";

export class SubmissionFilter extends PaginationFilter {
	problemId?: string;
	userId?: string;

	constructor(filter: Partial<SubmissionFilter>) {
		super(filter);
	}
}
