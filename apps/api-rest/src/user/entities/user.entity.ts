import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToMany, ManyToOne } from "typeorm";
import { Submission } from "../../programming/entities/submission.entity";
import { UserRole } from "../../shared/enums";
import { ToDto, toDtos } from "../../shared/interfaces/to-dto.interface";
import { UserDto } from "../dto/user.dto";
import { Permission } from "../../authorization/entities/permission.entity";

export type UserId = number;
export type SmsUserId = string;

@Entity()
export class User implements ToDto<UserDto> {
	@PrimaryGeneratedColumn()
	id!: UserId;

	@Column()
	smsUserId!: SmsUserId;

	@Column({ unique: true })
	username!: string;

	@Column({ type: "enum", enum: UserRole, default: UserRole.USER })
	role!: UserRole;

	@ManyToOne(type => Permission, permission => permission.users)
	permissions?: Permission[];

	@OneToMany(type => Submission, submission => submission.user)
	submissions?: Submission[];

	constructor(partial?: Partial<User>) {
		Object.assign(this, partial);
	}

	toDto(): UserDto {
		return {
			id: this.id,
			username: this.username,
			smsUserId: this.smsUserId,
			role: this.role,
			submissions: toDtos(this.submissions)
		};
	}
}
