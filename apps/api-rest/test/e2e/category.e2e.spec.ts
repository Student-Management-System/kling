import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { getConnection } from "typeorm";
import { createApplication } from "../mock/application/nest-application.mock";
import { DbMockService } from "../mock/db-mock.service";
import { CATEGORIES_STRINGS } from "../mock/problem/categories.mock";

let app: INestApplication;
let dbMockService: DbMockService;
const baseRoute = "/categories";

describe("PUT", () => {
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

	describe(`${baseRoute}/{name} - createCategory`, () => {
		const category = "NewCategory";
		const route = () => `${baseRoute}/${category}`;

		describe("Valid", () => {
			it("Creates a new category", () => {
				return request(app.getHttpServer()).put(route()).expect(200);
			});
		});

		describe("Invalid", () => {
			it("Category already exists -> 409 Conflict", async () => {
				const existingCategory = CATEGORIES_STRINGS[0];

				return request(app.getHttpServer())
					.put(`${baseRoute}/${existingCategory}`)
					.expect(409);
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

	describe(`${baseRoute} - findCategories`, () => {
		it("Retrieves all categories", () => {
			const expected = CATEGORIES_STRINGS;
			console.assert(expected.length > 1, "Expecting >1 categories in DB.");

			return request(app.getHttpServer())
				.get(`${baseRoute}`)
				.expect(200)
				.expect(({ body }) => {
					const result = body as string[];
					expect(result).toEqual(expected);
				});
		});

		it("Filters by name", () => {
			const name = "M";
			const expected = CATEGORIES_STRINGS.filter(c => c.startsWith(name));
			console.assert(expected.length > 1, "Expecting >1 categories to match");

			const queryString = `name=${name}`;

			return request(app.getHttpServer())
				.get(`${baseRoute}?${queryString}`)
				.expect(200)
				.expect(({ body }) => {
					const result = body as string[];
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
					const result = response.body as string[];
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

	describe(`${baseRoute}/{problemId} - removeCategory`, () => {
		const category = CATEGORIES_STRINGS[0];
		const route = () => `${baseRoute}/${category}`;

		describe("Valid", () => {
			it("Deletes the category", () => {
				return request(app.getHttpServer()).delete(route()).expect(200);
			});
		});

		describe("Invalid", () => {
			it("Category does not exist -> 404", () => {
				const doesNotExist = "XYZ";

				return request(app.getHttpServer()).get(`${baseRoute}/${doesNotExist}`).expect(404);
			});
		});
	});
});
