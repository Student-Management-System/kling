import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager, In, Repository } from "typeorm";
import { DbException, EntityAlreadyExistsError } from "../../shared/database-exception";
import { IRepository } from "../../shared/interfaces/repository.interface";
import { CategoryFilter } from "../dto/category.filter";
import { Category } from "../entities/category.entity";

@Injectable()
export class CategoryRepository implements IRepository<Category> {
	private readonly repo: Repository<Category>;

	constructor(@InjectEntityManager() manager: EntityManager) {
		this.repo = manager.getRepository(Category);
	}

	/**
	 * Creates a new category with the given name.
	 * Name must be unique.
	 * @throws `EntityAlreadyExistsError` if category with `name` already exists.
	 */
	async create(name: string): Promise<Category> {
		await this.repo.insert({ name }).catch(error => {
			if (error.code === DbException.PG_UNIQUE_VIOLATION) {
				throw new EntityAlreadyExistsError(name);
			}
		});
		return this.getByName(name);
	}

	async get(id: number): Promise<Category> {
		return this.repo.findOneOrFail(id);
	}

	/**
	 * Returns category with the specified name.
	 * @throws `EntityNotFoundError`, if entity does not exist.
	 */
	async getByName(name: string): Promise<Category> {
		return this.repo.findOneOrFail({ where: { name } });
	}

	/**
	 * Returns category with the specified name or undefined if it does not exist.
	 */
	async tryGet(...params: unknown[]): Promise<Category | undefined> {
		return this.repo.findOne({ where: { name } });
	}

	/**
	 * Returns all categories matching the specified filter.
	 */
	async find(filter?: CategoryFilter): Promise<[Category[], number]> {
		const { name, skip, take } = filter || {};
		const query = this.repo
			.createQueryBuilder("category")
			.skip(skip)
			.take(take)
			.orderBy("name");

		if (name) {
			query.where("category.name ILIKE :name", { name: `${name}%` });
		}

		return query.getManyAndCount();
	}

	/**
	 * Returns all categories with the specified names.
	 */
	async findExact(names: string[]): Promise<Category[]> {
		return this.repo.find({
			where: {
				name: In(names)
			}
		});
	}

	/**
	 * Deletes the category. Returns true, if removal was successful.
	 * @returns True, if category was removed successfully.
	 */
	async delete(name: string): Promise<boolean> {
		const category = await this.getByName(name);
		return !!this.repo.remove(category);
	}
}
