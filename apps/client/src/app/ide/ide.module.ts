import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FileTabsModule } from "@kling/file-tabs";
import { AngularSplitModule } from "angular-split";
import { environment } from "../../environments/environment";
import { SharedModule } from "../shared/shared.module";
import { ActivityBarModule } from "./activity-bar/activity-bar.module";
import { EditorModule } from "./editor/editor.module";
import { FeaturePanelModule } from "./feature-panel/feature-panel.module";
import { IdeRoutingModule } from "./ide-routing.module";
import { CodeExecutionService, PISTON_API_URL } from "./services/code-execution.service";
import { WorkspaceSettingsService } from "./services/workspace-settings.service";
import { SideBarModule } from "./side-bar/side-bar.module";
import { WorkspaceComponent } from "./workspace/workspace.component";
import { CreateProjectDialog } from "./dialogs/create-project/create-project.dialog";

@NgModule({
	declarations: [WorkspaceComponent, CreateProjectDialog],
	imports: [
		SharedModule,
		HttpClientModule,
		IdeRoutingModule,
		ActivityBarModule,
		SideBarModule,
		FileTabsModule,
		EditorModule,
		FeaturePanelModule,
		AngularSplitModule
	],
	providers: [
		WorkspaceSettingsService,
		CodeExecutionService,
		{
			provide: PISTON_API_URL,
			useValue:
				window["__env"]["PISTON_CODE_EXECUTION_BASE_PATH"] ??
				environment.PISTON_CODE_EXECUTION_BASE_PATH
		}
	],
	exports: []
})
export class IdeModule {}
