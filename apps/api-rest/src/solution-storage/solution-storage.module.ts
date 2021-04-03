import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { SolutionController } from "./controllers/solution-storage.controller";
import { SolutionStorageFacade } from "./solution-storage.facade";

@Module({
	imports: [CqrsModule],
	controllers: [SolutionController],
	providers: [SolutionStorageFacade]
})
export class SolutionStorageModule {}
