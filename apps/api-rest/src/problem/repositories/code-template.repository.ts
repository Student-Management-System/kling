import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { SolutionDto } from "../../programming/dto/solution.dto";
import { SolutionDao } from "../../programming/entities/solution.entity";
import { EntityAlreadyExistsError } from "../../shared/database-exception";
import { IRepository } from "../../shared/interfaces/repository.interface";
import { CodeTemplate } from "../entities/code-template.entity";
import { ProblemId } from "../entities/problem-dao.entity";

@Injectable()
export class CodeTemplateRepository implements IRepository<CodeTemplate> {
	private readonly repo: Repository<CodeTemplate>;

	constructor(@InjectEntityManager() manager: EntityManager) {
		this.repo = manager.getRepository(CodeTemplate);
	}

	/**
	 * Creates a new code template.
	 * @param problemId Id of the problem.
	 * @param language Programming language of the template.
	 * @param solution The code itself.
	 * @returns The created code template.
	 * @throws `EntityAlreadyExistsError`, if entity already exists.
	 */
	async create(
		problemId: ProblemId,
		language: string,
		solution: SolutionDto
	): Promise<CodeTemplate> {
		// Check if template already exists
		if (await this.tryGet(problemId, language)) {
			throw new EntityAlreadyExistsError(`${problemId} - ${language}`);
		}

		const codeTemplate = new CodeTemplate({
			problemId,
			language,
			solution: new SolutionDao({ solution: solution })
		});

		return this.repo.save(codeTemplate);
	}

	/**
	 * Returns a code template for the specified problem that is written in the given programming language.
	 * @param problemId
	 * @param language
	 * @throws `EntityNotFoundError`, if entity does not exist.
	 */
	async get(problemId: ProblemId, language: string): Promise<CodeTemplate> {
		return this.repo.findOneOrFail({
			where: {
				problemId,
				language
			},
			relations: ["solution"]
		});
	}

	async tryGet(problemId: ProblemId, language: string): Promise<CodeTemplate | undefined> {
		return this.repo.findOne({
			where: {
				problemId,
				language
			},
			relations: ["solution"]
		});
	}

	async find(...params: unknown[]): Promise<[CodeTemplate[], number]> {
		throw new Error("Method not implemented.");
	}

	/**
	 * Updates a code template.
	 * @param problemId Id of the problem.
	 * @param language Programming language.
	 * @param solution The code itself.
	 * @returns The updated code template.
	 */
	async update(
		problemId: ProblemId,
		language: string,
		solution: SolutionDto
	): Promise<CodeTemplate> {
		const template = await this.get(problemId, language);

		// Ensure dto contains correct values
		solution.language = language;
		solution.id = template.solutionId;

		if (!template.solution) {
			throw new Error(`${problemId} - ${language}: Solution was undefined.`);
		}

		// Update solution
		template.solution.solution = solution;
		return this.repo.save(template);
	}

	async delete(id: number): Promise<boolean> {
		return (await this.repo.delete(id)).affected == 1;
	}
}
