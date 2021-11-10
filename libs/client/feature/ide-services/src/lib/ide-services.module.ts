import { NgModule } from "@angular/core";
import { getEnvVariableOrThrow } from "@web-ide/client-environments";
import { CollaborationModule } from "@web-ide/collaboration";
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
