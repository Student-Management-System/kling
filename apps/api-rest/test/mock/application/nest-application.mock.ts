import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../src/app.module";
import { EntityNotFoundFilter } from "../../../src/shared/filters/entity-not-found.filter";
import { AuthGuard } from "@nestjs/passport";
import { AuthGuard_Admin } from "./guards";
import { EntityAlreadyExistsFilter } from "../../../src/shared/filters/entity-already-exists.filter";

/**
 * Creates and returns an initialized NestApplication for e2e-testing purposes.
 */
export async function createApplication(): Promise<INestApplication> {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule]
	})
		.overrideGuard(AuthGuard())
		.useValue(new AuthGuard_Admin())
		.compile();

	const app = moduleFixture.createNestApplication();
	app.useGlobalFilters(new EntityNotFoundFilter());
	app.useGlobalFilters(new EntityAlreadyExistsFilter());
	app.useGlobalPipes(new ValidationPipe({ transform: true })); // Automatically transform primitive params to their type
	await app.init();

	return app;
}
