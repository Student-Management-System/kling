import { NgModule } from "@angular/core";
import { getEnvVariableOrThrow } from "@kling/client-environments";
import { CodeExecutionService, PISTON_API_URL } from "./services/code-execution.service";
import { FileSystemAccess } from "./services/file-system-access.service";
import { WorkspaceDialogs } from "./services/workspace-dialogs.service";
import { WorkspaceSettingsService } from "./services/workspace-settings.service";
import { WorkspaceService } from "./services/workspace.service";

@NgModule({
	providers: [
		CodeExecutionService,
		WorkspaceDialogs,
		FileSystemAccess,
		WorkspaceSettingsService,
		WorkspaceService,
		{
			provide: PISTON_API_URL,
			useValue: getEnvVariableOrThrow("PISTON_CODE_EXECUTION_BASE_PATH")
		}
	]
})
export class IdeServicesModule {}
