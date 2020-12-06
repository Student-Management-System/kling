/* eslint-disable @typescript-eslint/interface-name-prefix */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { ProblemId } from "../../problem/entities/problem-dao.entity";
import { IRepository } from "../../shared/interfaces/repository.interface";
import { UserId } from "../../user/entities/user.entity";
import { SubmissionFilter } from "../dto/submission-filter.dto";
import { SubmissionDto } from "../dto/submission.dto";
import { Evaluation } from "../entities/evaluation.entity";
import { SolutionDao } from "../entities/solution.entity";
import { SubmissionTag } from "../entities/submission-tag.entity";
import { Submission, SubmissionId } from "../entities/submission.entity";

@EntityRepository(Submission)
export class SubmissionOrm extends Repository<Submission> {}

@Injectable()
export class SubmissionRepository implements IRepository<Submission> {
	constructor(@InjectRepository(SubmissionOrm) private repo: SubmissionOrm) {}

	async create(
		problemId: ProblemId,
		userId: UserId,
		submissionDto: SubmissionDto
	): Promise<Submission> {
		const { solution, tags } = submissionDto;

		const submission = new Submission({
			problemId,
			userId,
			solution: new SolutionDao({ solution: solution }),
			tags: tags?.map(tag => new SubmissionTag({ name: tag })),
			evaluation: new Evaluation({})
		});

		return this.repo.save(submission);
	}

	async get(id: SubmissionId): Promise<Submission> {
		return this.repo.findOneOrFail(id, {
			relations: ["user", "solution", "problem"]
		});
	}

	async tryGet(id: SubmissionId): Promise<Submission | undefined> {
		return this.repo.findOneOrFail(id, {
			relations: ["user", "solution", "problem"]
		});
	}

	async find(filter?: SubmissionFilter): Promise<[Submission[], number]> {
		const { problemId, userId, skip, take } = filter || {};

		const query = this.repo.createQueryBuilder("submission").skip(skip).take(take);

		if (problemId) {
			query.andWhere("submission.problemId = :problemId", { problemId });
		}

		if (userId) {
			query.andWhere("submission.userId = :userId", { userId });
		}

		return query.getManyAndCount();
	}

	async delete(id: SubmissionId): Promise<boolean> {
		return (await this.repo.delete(id)).affected == 1;
	}
}
