import { UserRole } from "../../shared/enums";
import { SubmissionDto } from "../../programming/dto/submission.dto";
import { UserId } from "../entities/user.entity";

export class UserDto {
	id!: UserId;
	username!: string;
	smsUserId!: string;
	role!: UserRole;
	submissions?: SubmissionDto[];
}
