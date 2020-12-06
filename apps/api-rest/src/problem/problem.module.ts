import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { AuthorizationModule } from "../authorization/authorization.module";
import { CommandHandlers } from "./commands";
import { Controllers } from "./controllers";
import { Entities } from "./entities";
import { EventHandlers } from "./events";
import { Repositories } from "./repositories";
import { Services } from "./services";

@Module({
	imports: [TypeOrmModule.forFeature([...Entities]), CqrsModule, AuthModule, AuthorizationModule],
	controllers: [...Controllers],
	providers: [...Services, ...Repositories, ...EventHandlers, ...CommandHandlers]
})
export class ProblemModule {}
