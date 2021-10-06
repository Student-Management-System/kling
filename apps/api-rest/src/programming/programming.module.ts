import { HttpModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrmRepositories, Repositories } from "./repositories";

@Module({
	imports: [TypeOrmModule.forFeature([...OrmRepositories]), HttpModule],
	controllers: [],
	providers: [...Repositories]
})
export class ProgrammingModule {}
