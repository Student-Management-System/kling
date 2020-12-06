import { Difficulty, ProblemDto } from "../../../src/problem/dto/problem/problem.dto";
import { ProblemDao } from "../../../src/problem/entities/problem-dao.entity";
import { USER_DTO_ADMIN } from "../user/users.mock";
import { CATEGORIES } from "./categories.mock";

function ProblemWithCategories(problem: ProblemDto): ProblemDao {
	const entity = new ProblemDao(problem as any);
	entity.categories = [];
	problem.categories.forEach(category => {
		const found = CATEGORIES.find(c => c.name === category);
		if (found) entity.categories.push(found);
	});
	return entity;
}

export const PROBLEM_DTO_TWO_SUM = (): ProblemDto => ({
	id: "two-sum",
	title: "Two Sum",
	categories: ["Array", "Map"],
	difficulty: Difficulty.EASY,
	creationDate: new Date(2020, 7, 1),
	creatorId: USER_DTO_ADMIN().id
});
export const PROBLEM_TWO_SUM = (): ProblemDao =>
	new ProblemDao(ProblemWithCategories(PROBLEM_DTO_TWO_SUM()));

export const PROBLEM_DTO_ADD_TWO_NUMBERS = (): ProblemDto => ({
	id: "add-two-numbers",
	title: "Add two numbers",
	categories: ["Math"],
	difficulty: Difficulty.MEDIUM,
	creationDate: new Date(2020, 7, 2),
	creatorId: USER_DTO_ADMIN().id
});
export const PROBLEM_ADD_TWO_NUMBERS = (): ProblemDao =>
	new ProblemDao(ProblemWithCategories(PROBLEM_DTO_ADD_TWO_NUMBERS()));

export const PROBLEM_DTO_NUMBER_OF_GOOD_PAIRS = (): ProblemDto => ({
	id: "number-of-good-pairs",
	title: "Number of good pairs",
	categories: ["Array", "Map", "Loop"],
	difficulty: Difficulty.HARD,
	creationDate: new Date(2020, 7, 3),
	creatorId: USER_DTO_ADMIN().id
});
export const PROBLEM_NUMBER_OF_GOOD_PAIRS = (): ProblemDao =>
	new ProblemDao(ProblemWithCategories(PROBLEM_DTO_NUMBER_OF_GOOD_PAIRS()));

export const PROBLEM_DTO_MOCKS: ProblemDto[] = [
	PROBLEM_DTO_TWO_SUM(),
	PROBLEM_DTO_ADD_TWO_NUMBERS(),
	PROBLEM_DTO_NUMBER_OF_GOOD_PAIRS()
];

export const PROBLEM_MOCKS: ProblemDao[] = [
	PROBLEM_TWO_SUM(),
	PROBLEM_ADD_TWO_NUMBERS(),
	PROBLEM_NUMBER_OF_GOOD_PAIRS()
];
