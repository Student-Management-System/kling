import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "./repositories/user.repository";
import { OrmRepositories } from "./repositories";

@Module({
	imports: [TypeOrmModule.forFeature([...OrmRepositories])],
	providers: [UserRepository],
	exports: [TypeOrmModule, UserRepository]
})
export class UserModule {}
