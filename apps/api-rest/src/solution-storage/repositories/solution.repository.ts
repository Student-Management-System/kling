import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { SolutionDao } from "../../programming/entities/solution.entity";
import { IRepository } from "../../shared/interfaces/repository.interface";

export class SolutionFilter {
	userId?: string;
}

@Injectable()
export class SolutionRepository implements IRepository<SolutionDao> {
	private readonly repo: Repository<SolutionDao>;

	constructor(@InjectEntityManager() manager: EntityManager) {
		this.repo = manager.getRepository(SolutionDao);
	}

	create(...params: unknown[]): Promise<SolutionDao> {
		return;
	}

	get(...params: unknown[]): Promise<SolutionDao> {
		throw new Error("Method not implemented.");
	}

	getPure?(...params: unknown[]): Promise<SolutionDao> {
		throw new Error("Method not implemented.");
	}

	tryGet(...params: unknown[]): Promise<SolutionDao> {
		throw new Error("Method not implemented.");
	}

	find(...params: unknown[]): Promise<[SolutionDao[], number]> {
		throw new Error("Method not implemented.");
	}

	update?(...params: unknown[]): Promise<SolutionDao> {
		throw new Error("Method not implemented.");
	}

	delete(...params: unknown[]): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
}
