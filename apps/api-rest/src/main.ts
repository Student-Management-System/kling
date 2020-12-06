import { Logger, LogLevel, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as config from "config";
import { getConnection } from "typeorm";
import { DbMockService } from "../test/mock/db-mock.service";
import { AppModule } from "./app.module";
import { Messages } from "./collaboration/messages";
import { EntityAlreadyExistsFilter } from "./shared/filters/entity-already-exists.filter";
import { EntityNotFoundFilter } from "./shared/filters/entity-not-found.filter";

async function bootstrap(): Promise<void> {
	const logger = new Logger("Bootstrap");
	const logLevels = (config.get("logger.levels") ?? []) as LogLevel[];
	console.log("Log levels:", logLevels);

	logger.verbose(`Environment: ${process.env.NODE_ENV}`);

	const serverConfig = config.get("server");
	const port = process.env.SERVER_PORT || (serverConfig as any).port;

	logger.verbose("Creating application...");
	const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger: logLevels });
	logger.verbose("Application created!");

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.NATS,
		options: {
			url: process.env.NATS_URL
		}
	});

	app.useGlobalPipes(new ValidationPipe({ transform: true })); // Automatically transform primitive params to their type
	app.useGlobalFilters(new EntityNotFoundFilter());
	app.useGlobalFilters(new EntityAlreadyExistsFilter());
	app.enableCors({ exposedHeaders: "x-total-count" });
	app.disable("x-powered-by");

	const options = new DocumentBuilder()
		.addBearerAuth()
		.setTitle("Kling-API")
		.setDescription(`The Kling-API. <a href='${config.get("server.url")}/api-json'>JSON</a>`)
		.setVersion("1.0")
		.addTag("authentication")
		.addTag("problem")
		.addTag("category")
		.addTag("submission")
		.addTag("user")
		.build();
	const document = SwaggerModule.createDocument(app, options, { extraModels: [...Messages] });
	SwaggerModule.setup("api", app, document);

	// If demo environment, populate database with test data
	if (process.env.NODE_ENV == "demo") {
		await new DbMockService(getConnection()).createAll();
	}

	logger.verbose("Starting application...");
	await app.startAllMicroservicesAsync();
	await app.listen(port);
	logger.verbose(`Application started! (Port: ${port})`);
}
bootstrap();
