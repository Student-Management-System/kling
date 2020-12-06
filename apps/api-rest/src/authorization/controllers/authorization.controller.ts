import { Body, Controller, NotImplementedException, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SetRoleDto } from "../dto/set-role.dto";

@ApiBearerAuth()
@ApiTags("authorization")
@UseGuards(AuthGuard())
@Controller("authorization")
export class AuthorizationController {
	constructor() {}

	@Post("roles")
	@ApiOperation({
		operationId: "setRole",
		summary: "Set user role.",
		description: "Sets the user's role the the selected role."
	})
	setRole(@Body() setRoleDto: SetRoleDto): Promise<void> {
		throw new NotImplementedException();
	}
}
