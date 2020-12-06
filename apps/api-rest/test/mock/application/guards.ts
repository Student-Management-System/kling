import { ExecutionContext } from "@nestjs/common";
import { USER_ADMIN } from "../user/users.mock";

/* eslint-disable @typescript-eslint/class-name-casing */
export class AuthGuard_Admin {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		request.user = USER_ADMIN();
		return true;
	}
}
