import { UserRole } from "../../../src/shared/enums";
import { UserDto } from "../../../src/user/dto/user.dto";
import { User } from "../../../src/user/entities/user.entity";

export const USER_DTO_ADMIN = (): UserDto => ({
	id: 1,
	smsUserId: "123-456-789",
	username: "kling",
	role: UserRole.ADMIN
});
export const USER_ADMIN = (): User => new User(USER_DTO_ADMIN() as any);

export const USER_DTO_MOCKS: UserDto[] = [USER_DTO_ADMIN()];

export const USER_MOCKS: User[] = [USER_ADMIN()];
