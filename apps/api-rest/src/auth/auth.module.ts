import { HttpModule, Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";

@Module({
	imports: [HttpModule, UserModule],
	controllers: [],
	providers: [],
	exports: []
})
export class AuthModule {}
