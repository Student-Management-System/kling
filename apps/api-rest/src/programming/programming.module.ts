import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RunCodeGateway } from "./gateways/run-code.gateway";
import { OrmRepositories, Repositories } from "./repositories";
import { ReviewServiceProxy } from "./services/review-service-proxy.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([...OrmRepositories]),
		ClientsModule.register([
			{
				name: "REVIEW_SERVICE",
				transport: Transport.NATS,
				options: {
					url: process.env.NATS_URL,
					queue: "review"
				}
			}
		])
	],
	controllers: [],
	providers: [
		...Repositories,
		RunCodeGateway,
		ReviewServiceProxy
		//{ provide: "REVIEW_SERVICE", useValue: { } }
	]
})
export class ProgrammingModule {}
