import { Module, Provider } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as config from "config";
import { typeOrmConfig } from "./.config/typeorm-config";
import { AuthModule } from "./auth/auth.module";
import { AuthorizationModule } from "./authorization/authorization.module";
import { CollaborationModule } from "./collaboration/collaboration.module";
import { ProblemModule } from "./problem/problem.module";
import { ProgrammingModule } from "./programming/programming.module";
import { SolutionStorageModule } from "./solution-storage/solution-storage.module";
import { UserModule } from "./user/user.module";
import { RequestLogger } from "./utils/request.logger";

const optionalProviders = (): Provider<any>[] => {
	const providers: Provider<any>[] = [];
	if ((config.get("logger") as any).requests) {
		providers.push({ provide: APP_INTERCEPTOR, useClass: RequestLogger });
	}
	return providers;
};

@Module({
	imports: [
		TypeOrmModule.forRoot(typeOrmConfig),
		AuthModule,
		AuthorizationModule,
		UserModule,
		ProgrammingModule,
		ProblemModule,
		CollaborationModule,
		SolutionStorageModule
	],
	controllers: [],
	providers: [...optionalProviders()]
})
export class AppModule {}
