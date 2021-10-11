import { NgModule } from "@angular/core";
import { environment } from "apps/client/src/environments/environment";
import { CodeExecutionService, PISTON_API_URL } from "./services/code-execution.service";
import { FileExplorerDialogs } from "./services/file-explorer-dialogs.service";
import { FileSystemAccess } from "./services/file-system-access.service";
import { WorkspaceSettingsService } from "./services/workspace-settings.service";
import { WorkspaceService } from "./services/workspace.service";

@NgModule({
	providers: [
		CodeExecutionService,
		FileExplorerDialogs,
		FileSystemAccess,
		WorkspaceSettingsService,
		WorkspaceService,
		{
			provide: PISTON_API_URL,
			useValue:
				window["__env"]["PISTON_CODE_EXECUTION_BASE_PATH"] ??
				environment.PISTON_CODE_EXECUTION_BASE_PATH
		}
	]
})
export class IdeServicesModule {}
