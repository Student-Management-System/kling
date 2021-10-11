import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { SharedModule } from "@kling/client-shared";
import { FileTabsModule } from "@kling/file-tabs";
import { GetStartedModule } from "@kling/get-started";
import { AngularSplitModule } from "angular-split";
import { ActivityBarModule } from "./activity-bar/activity-bar.module";
import { CreateProjectDialog } from "./dialogs/create-project/create-project.dialog";
import { FeaturePanelModule } from "./feature-panel/feature-panel.module";
import { IdeRoutingModule } from "./ide-routing.module";
import { SideBarModule } from "./side-bar/side-bar.module";
import { WorkspaceComponent } from "./workspace/workspace.component";
import { CodeEditorModule } from "@kling/code-editor";

@NgModule({
	declarations: [WorkspaceComponent, CreateProjectDialog],
	imports: [
		SharedModule,
		HttpClientModule,
		IdeRoutingModule,
		GetStartedModule,
		ActivityBarModule,
		SideBarModule,
		FileTabsModule,
		CodeEditorModule,
		FeaturePanelModule,
		AngularSplitModule
	]
})
export class IdeModule {}
