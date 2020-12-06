import { Connection } from "typeorm";
import { Category } from "../../src/problem/entities/category.entity";
import { ProblemDao } from "../../src/problem/entities/problem-dao.entity";
import { User } from "../../src/user/entities/user.entity";
import { CATEGORIES } from "./problem/categories.mock";
import { PROBLEM_MOCKS } from "./problem/problems.mock";
import { USER_MOCKS } from "./user/users.mock";

export class DbMockService {
	private categories = CATEGORIES;
	private users = USER_MOCKS;
	private problems = PROBLEM_MOCKS;

	constructor(private con: Connection) {}

	async createAll(): Promise<void> {
		await this.createUsers();
		await this.createCategories();
		await this.createProblems();
	}

	async createUsers(): Promise<DbMockService> {
		await this.con
			.getRepository(User)
			.insert(this.users)
			.catch(error => console.error(error));
		return this;
	}

	async createCategories(): Promise<DbMockService> {
		await this.con
			.getRepository(Category)
			.insert(this.categories)
			.catch(error => console.error(error));
		return this;
	}

	async createProblems(): Promise<DbMockService> {
		await this.con
			.getRepository(ProblemDao)
			.save(this.problems)
			.catch(error => console.error(error));
		return this;
	}
}
