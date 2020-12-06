import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { AuthorizationController } from "./controllers/authorization.controller";
import { RoleGuard } from "./guards/role.guard";

@Module({
	imports: [AuthModule],
	controllers: [AuthorizationController],
	providers: [RoleGuard],
	exports: []
})
export class AuthorizationModule {}
