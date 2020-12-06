import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { getConnection } from "typeorm";
import { ProblemDto, Difficulty } from "../../src/problem/dto/problem/problem.dto";
import { createApplication } from "../mock/application/nest-application.mock";
import { DbMockService } from "../mock/db-mock.service";
import { PROBLEM_DTO_TWO_SUM, PROBLEM_DTO_MOCKS } from "../mock/problem/problems.mock";

let app: INestApplication;
let dbMockService: DbMockService;
const baseRoute = "/problems";

describe("PUT", () => {
	beforeEach(async () => {
		app = await createApplication();

		// Setup mocks
		dbMockService = new DbMockService(getConnection());
		await dbMockService.createUsers();
		await dbMockService.createCategories();
	});

	afterEach(async () => {
		await getConnection().dropDatabase(); // Drop database with all tables and data
		await getConnection().close(); // Close Db-Connection after all tests have been executed
	});

	describe(`${baseRoute}/{problemId} - createProblem`, () => {
		let problem: ProblemDto;
		const route = () => `${baseRoute}/${problem.id}`;

		beforeEach(() => {
			problem = PROBLEM_DTO_TWO_SUM();
		});

		describe("Valid", () => {
			it("Creates a new problem", () => {
				return request(app.getHttpServer())
					.put(route())
					.send(problem)
					.expect(200)
					.expect(({ body }) => {
						const result = body as ProblemDto;
						result.creationDate = undefined;
						problem.creationDate = undefined;
						expect(result).toEqual(problem);
					});
			});
		});

		describe("Invalid", () => {
			it("Id already exists -> 409 Conflict", async () => {
				await dbMockService.createProblems();

				return request(app.getHttpServer()).put(route()).send(problem).expect(409);
			});
		});
	});
});

describe("GET", () => {
	beforeAll(async () => {
		app = await createApplication();

		// Setup mocks
		dbMockService = new DbMockService(getConnection());
		await dbMockService.createAll();
	});

	afterAll(async () => {
		await getConnection().dropDatabase(); // Drop database with all tables and data
		await getConnection().close(); // Close Db-Connection after all tests have been executed
	});

	describe(`${baseRoute}/{problemId} - getProblem`, () => {
		let problem: ProblemDto;
		const route = () => `${baseRoute}/${problem.id}`;

		beforeEach(() => {
			problem = PROBLEM_DTO_TWO_SUM();
		});

		describe("Valid", () => {
			it("Retrieves problem", () => {
				return request(app.getHttpServer())
					.get(route())
					.expect(200)
					.expect(({ body }) => {
						const result = body as ProblemDto;
						expect(result.id).toEqual(problem.id);
						expect(result.title).toEqual(problem.title);
						expect(result.categories).toEqual(problem.categories);
						expect(result.creator).toBeTruthy();
					});
			});
		});

		describe("Invalid", () => {
			it("Problem does not exist -> 404", () => {
				problem.id = "DOES_NOT_EXIST";

				return request(app.getHttpServer()).get(route()).expect(404);
			});
		});
	});

	describe(`${baseRoute}/{problemId} - findProblems`, () => {
		it("Retrieves all problems", () => {
			const expected = PROBLEM_DTO_MOCKS;
			console.assert(expected.length > 1, "Expecting > 1 problems in DB.");

			return request(app.getHttpServer())
				.get(baseRoute)
				.expect(({ body }) => {
					const result = body as ProblemDto[];
					expect(result.length).toEqual(expected.length);
					expect(result[0].id).toBeTruthy();
					expect(result[0].title).toBeTruthy();
					expect(result[0].difficulty).toBeTruthy();
					expect(result[0].creator).toBeTruthy();
					expect(result[0].categories).toBeTruthy();
				});
		});

		it("Filters by title", () => {
			const title = "umber";
			const expected = PROBLEM_DTO_MOCKS.filter(p => p.title.includes(title));
			console.assert(
				expected.length > 1 && expected.length < PROBLEM_DTO_MOCKS.length,
				"Expecting more than 1 and not all problems to match."
			);

			const queryString = `title=${title}`;

			return request(app.getHttpServer())
				.get(`${baseRoute}?${queryString}`)
				.expect(200)
				.expect(({ body }) => {
					const result = body as ProblemDto[];
					expect(result.length).toBeGreaterThan(1);
					expect(result.length).toEqual(expected.length);
				});
		});

		it("Filters by difficulty", () => {
			const expected = PROBLEM_DTO_MOCKS.filter(p => p.difficulty === Difficulty.EASY);
			console.assert(
				expected.length >= 1 && expected.length < PROBLEM_DTO_MOCKS.length,
				"Expecting at least 1 and not all problems to match."
			);

			const queryString = `difficulties=${Difficulty.EASY}`;

			return request(app.getHttpServer())
				.get(`${baseRoute}?${queryString}`)
				.expect(200)
				.expect(({ body }) => {
					const result = body as ProblemDto[];
					expect(result.length).toBeGreaterThan(0);
					expect(result.length).toEqual(expected.length);
				});
		});

		it("Filters by difficulty with multiple difficulties selected", () => {
			// Query for both EASY and MEDIUM
			const expected = PROBLEM_DTO_MOCKS.filter(
				p => p.difficulty === Difficulty.EASY || p.difficulty === Difficulty.MEDIUM
			);
			console.assert(
				expected.length > 1 && expected.length < PROBLEM_DTO_MOCKS.length,
				"Expecting more than 1 and not all problems to match."
			);

			const queryString = `difficulties=${Difficulty.EASY}&difficulties=${Difficulty.MEDIUM}`;

			return request(app.getHttpServer())
				.get(`${baseRoute}?${queryString}`)
				.expect(200)
				.expect(({ body }) => {
					const result = body as ProblemDto[];
					expect(result.length).toBeGreaterThan(1);
					expect(result.length).toEqual(expected.length);
				});
		});

		it("Filters by category", () => {
			const category = "Array";
			const expected = PROBLEM_DTO_MOCKS.filter(p => p.categories.includes(category));
			console.assert(
				expected.length > 1 && expected.length < PROBLEM_DTO_MOCKS.length,
				"Expecting more than 1 and not all problems to match."
			);

			const queryString = `categories=${category}`;

			return request(app.getHttpServer())
				.get(`${baseRoute}?${queryString}`)
				.expect(200)
				.expect(({ body }) => {
					const result = body as ProblemDto[];
					expect(result.length).toBeGreaterThan(1);
					expect(result.length).toEqual(expected.length);
				});
		});

		it("Filters by category with multiple categories selected", () => {
			const category1 = "Array";
			const category2 = "Map";
			const expected = PROBLEM_DTO_MOCKS.filter(
				p => p.categories.includes(category1) || p.categories.includes(category2)
			);
			console.assert(
				expected.length >= 1 && expected.length < PROBLEM_DTO_MOCKS.length,
				"Expecting at least 1 and not all problems to match."
			);

			const queryString = `categories=${category1}&categories=${category2}`;

			return request(app.getHttpServer())
				.get(`${baseRoute}?${queryString}`)
				.expect(200)
				.expect(({ body }) => {
					const result = body as ProblemDto[];
					expect(result.length).toBeGreaterThan(0);
					expect(result.length).toEqual(expected.length);
				});
		});

		it("Uses pagination", () => {
			const skip = 1;
			const take = 1;

			const expectedLength = 1;

			const queryString = `skip=${skip}&take=${take}`;

			return request(app.getHttpServer())
				.get(`${baseRoute}?${queryString}`)
				.expect(200)
				.expect(response => {
					const result = response.body as ProblemDto[];
					expect(result.length).toEqual(expectedLength);
					expect(response.get("X-TOTAL-COUNT")).toBeTruthy();
				});
		});
	});
});

describe("DELETE", () => {
	beforeEach(async () => {
		app = await createApplication();

		// Setup mocks
		dbMockService = new DbMockService(getConnection());
		await dbMockService.createAll();
	});

	afterEach(async () => {
		await getConnection().dropDatabase(); // Drop database with all tables and data
		await getConnection().close(); // Close Db-Connection after all tests have been executed
	});

	describe(`${baseRoute}/{problemId} - removeProblem`, () => {
		let problem: ProblemDto;
		const route = () => `${baseRoute}/${problem.id}`;

		beforeEach(() => {
			problem = PROBLEM_DTO_TWO_SUM();
		});

		describe("Valid", () => {
			it("Deletes problem", () => {
				return request(app.getHttpServer()).delete(route()).expect(200);
			});
		});
	});
});
