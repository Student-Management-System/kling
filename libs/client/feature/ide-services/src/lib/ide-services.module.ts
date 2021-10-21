import { NgModule } from "@angular/core";
import { getEnvVariableOrThrow } from "@kling/client-environments";
import { CollaborationModule } from "@kling/collaboration";
import { CodeExecutionService, PISTON_API_URL } from "./services/code-execution.service";
import { FileSystemAccess } from "./services/file-system-access.service";
import { WorkspaceSettingsService } from "./services/workspace-settings.service";

@NgModule({
	imports: [CollaborationModule],
	providers: [
		CodeExecutionService,
		FileSystemAccess,
		WorkspaceSettingsService,
		{
			provide: PISTON_API_URL,
			useValue: getEnvVariableOrThrow("PISTON_CODE_EXECUTION_BASE_PATH")
		}
	]
})
export class IdeServicesModule {}
