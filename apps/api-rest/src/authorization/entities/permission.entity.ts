import { Entity, PrimaryColumn, OneToMany } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Permission {
	@PrimaryColumn()
	name!: string;

	@OneToMany(type => User, user => user.permissions)
	users?: User[];
}
