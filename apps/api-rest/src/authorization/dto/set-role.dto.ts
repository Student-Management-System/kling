import { UserId } from "../../user/entities/user.entity";
import { IsNotEmpty } from "class-validator";
import { UserRole } from "../../shared/enums";

export class SetRoleDto {
	@IsNotEmpty()
	userId!: UserId;

	@IsNotEmpty()
	role!: UserRole;
}
