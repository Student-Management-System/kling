import { PaginationFilter } from "../../shared/pagination.filter";

export class UserFilter extends PaginationFilter {
	username?: string;

	constructor(filter: Partial<UserFilter>) {
		super(filter);
		this.username = filter?.username;
	}
}
