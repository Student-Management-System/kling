import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		transport: Transport.NATS,
		options: {
			url: "nats://host.docker.internal:4222",
			queue: "review"
		}
	});

	app.useGlobalPipes(new ValidationPipe({ transform: true })); // Automatically transform primitive params to their type

	app.listen(() => {});
}
bootstrap();
