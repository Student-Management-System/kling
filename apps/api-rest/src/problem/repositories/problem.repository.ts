import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { TestCase } from "../../programming/entities/test-case.entity";
import { EntityAlreadyExistsError } from "../../shared/database-exception";
import { IRepository } from "../../shared/interfaces/repository.interface";
import { Problem } from "../domain/problem.model";
import { ProblemFilter } from "../dto/problem/problem-filter";
import { Category } from "../entities/category.entity";
import { ProblemDao, ProblemId } from "../entities/problem-dao.entity";
import { CategoryRepository } from "./category.repository";

@Injectable()
export class ProblemRepository implements IRepository<ProblemDao> {
	private readonly repo: Repository<ProblemDao>;

	constructor(
		@InjectEntityManager() manager: EntityManager,
		private categoryRepository: CategoryRepository
	) {
		this.repo = manager.getRepository(ProblemDao);
	}

	/**
	 * Creates a new problem.
	 * `Category` and `Template` relations will also be created, if included.
	 * @throws `EntityAlreadyExistsError`, if problem with id already exists.
	 */
	async create(problem: Problem): Promise<ProblemDao> {
		const { id, title, categories, difficulty, testCases, creatorId } = problem;

		// Check problem with id does not exist already
		if (await this.tryGet(id)) {
			throw new EntityAlreadyExistsError(id);
		}

		// Find categories, if specified
		let categoryEntities: Category[] = [];
		if (categories?.length > 0) {
			categoryEntities = await this.categoryRepository.findExact(categories);
		}

		let testCaseEntities: TestCase[] = [];
		if (testCases?.length! > 0) {
			testCaseEntities = testCases!.map(test => new TestCase(test));
		}

		// Insert new problem
		const problemDao = new ProblemDao({
			id: id,
			title,
			difficulty,
			testCases: testCaseEntities,
			categories: categoryEntities,
			creatorId
		});

		return this.repo.save(problemDao);
	}

	/**
	 * Assigns a category to the problem. A problem can have multiple categories.
	 * @param id Id of the problem.
	 * @param name Name of the category.
	 * @returns True, if category was added successfully.
	 * @throws Error, if problem already has the given category.
	 */
	async assignCategory(problemId: ProblemId, name: string): Promise<boolean> {
		const [problem, category] = await Promise.all([
			this.get(problemId),
			this.categoryRepository.getByName(name)
		]);

		// Check if problem already has this category
		if (problem.categories.find(c => c.id === category.id)) {
			throw new EntityAlreadyExistsError();
		}

		// Add category
		problem.categories.push(category);
		return !!(await this.repo.save(problem));
	}

	/**
	 * Returns problem with the specified id.
	 *
	 * Includes relations:
	 * - Categories
	 * - Creator
	 * @throws `EntityNotFoundError`, if entity does not exist.
	 */
	async get(problemId: ProblemId): Promise<ProblemDao> {
		return this.repo.findOneOrFail(problemId, {
			relations: ["categories", "creator"]
		});
	}

	/**
	 * Returns problem with the specified id.
	 * Does not contain relations.
	 * @throws `EntityNotFoundError`, if entity does not exist.
	 */
	async getPure(problemId: ProblemId): Promise<ProblemDao> {
		return this.repo.findOneOrFail(problemId);
	}

	/**
	 * Returns problem with the specified id, if it exists.
	 */
	async tryGet(problemId: ProblemId): Promise<ProblemDao | undefined> {
		return this.repo.findOne(problemId);
	}

	/**
	 * Returns all problems that match the given filter.
	 * Also returns the total count of elements.
	 *
	 * Includes relations:
	 * - Categories
	 * - Creator
	 */
	async find(filter?: ProblemFilter): Promise<[ProblemDao[], number]> {
		const { title, difficulties, categories, skip, take } = filter || {};

		const query = this.repo
			.createQueryBuilder("problem")
			.leftJoinAndSelect("problem.categories", "category")
			.leftJoinAndSelect("problem.creator", "creator")
			.orderBy("problem.creationDate", "DESC")
			.skip(skip)
			.take(take);

		// Filter by title
		if (title) {
			query.andWhere("problem.title ILIKE :title", { title: `%${title}%` });
		}

		// Filter by difficulties
		if (difficulties && difficulties.length > 0) {
			query.andWhere("problem.difficulty IN (:...difficulties)", { difficulties });
		}

		// Filter by categories
		if (categories && categories.length > 0) {
			query.andWhere("category.name IN (:...categories)", { categories });
		}

		return query.getManyAndCount();
	}

	/**
	 * Deletes problem with the specified id.
	 * @returns True, if problem was deleted successfully.
	 */
	async delete(problemId: ProblemId): Promise<boolean> {
		const problem = await this.repo.findOneOrFail(problemId);
		return !!(await this.repo.remove(problem));
	}
}
