import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityRepository } from "typeorm";
import { DbException, EntityAlreadyExistsError } from "../../shared/database-exception";
import { UserRole } from "../../shared/enums";
import { IRepository } from "../../shared/interfaces/repository.interface";
import { UserFilter } from "../dto/user-filter.dto";
import { User, SmsUserId, UserId } from "../entities/user.entity";

@EntityRepository(User)
export class UserOrm extends Repository<User> {}

@Injectable()
export class UserRepository implements IRepository<User> {
	constructor(@InjectRepository(UserOrm) private repo: UserOrm) {}

	async create(username: string, smsUserId: SmsUserId, role?: UserRole): Promise<User> {
		const user = new User({
			username,
			smsUserId,
			role: role ?? UserRole.USER
		});

		await this.repo.insert(user).catch(error => {
			if (error === DbException.PG_UNIQUE_VIOLATION) {
				throw new EntityAlreadyExistsError();
			}
		});

		return this.getByUsername(username);
	}

	async get(userId: UserId): Promise<User> {
		return this.repo.findOneOrFail(userId);
	}

	async getBySmsUserId(smsUserId: SmsUserId): Promise<User> {
		return this.repo.findOneOrFail({
			where: { smsUserId }
		});
	}

	async getByUsername(username: string): Promise<User> {
		return this.repo.findOneOrFail({
			where: { username }
		});
	}

	async tryGet(userId: UserId): Promise<User | undefined> {
		return this.repo.findOne(userId);
	}

	async find(filter?: UserFilter): Promise<[User[], number]> {
		const { username, skip, take } = filter || {};

		const query = this.repo.createQueryBuilder("user").skip(skip).take(take);

		if (username) {
			query.andWhere("user.username ILIKE :username", { username: `%${username}%` });
		}

		return query.getManyAndCount();
	}

	async delete(userId: UserId): Promise<boolean> {
		const user = await this.get(userId);
		return !!(await this.repo.remove(user));
	}
}
