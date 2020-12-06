import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserDto } from "../../user/dto/user.dto";
import { UserRole } from "../../shared/enums";

/**
 * Only allows requests for users, that have the required permission to create problems.
 * Assumes that `user` property was attached to the request.
 */
@Injectable()
export class CreateProblemPermission implements CanActivate {
	constructor() {}

	canActivate(context: ExecutionContext): boolean {
		const user: UserDto = context.switchToHttp().getRequest().user;

		if (user.role === UserRole.ADMIN) {
			return true;
		}

		return false;
	}
}
