import { NgModule } from "@angular/core";
import { getEnvVariableOrThrow } from "@kling/client-environments";
import { CollaborationModule } from "@kling/collaboration";
import { PISTON_API_URL } from "./services/code-execution.service";

@NgModule({
	imports: [CollaborationModule],
	providers: [
		{
			provide: PISTON_API_URL,
			useValue: getEnvVariableOrThrow("PISTON_CODE_EXECUTION_BASE_PATH")
		}
	]
})
export class IdeServicesModule {}
