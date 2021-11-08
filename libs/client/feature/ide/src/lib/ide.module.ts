import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { CodeEditorModule } from "@kling/code-editor";
import { FileTabsModule } from "@kling/file-tabs";
import { GetStartedModule } from "@kling/get-started";
import { AngularSplitModule } from "angular-split";
import { ActivityBarModule } from "./activity-bar/activity-bar.module";
import { FeaturePanelModule } from "./feature-panel/feature-panel.module";
import { RunCodeModule } from "./run-code/run-code.module";
import { SideBarModule } from "./side-bar/side-bar.module";
import { WorkspaceComponent } from "./workspace/workspace.component";

@NgModule({
	declarations: [WorkspaceComponent],
	exports: [WorkspaceComponent],
	imports: [
		CommonModule,
		HttpClientModule,
		GetStartedModule,
		ActivityBarModule,
		SideBarModule,
		FileTabsModule,
		RunCodeModule,
		CodeEditorModule,
		FeaturePanelModule,
		AngularSplitModule
	]
})
export class IdeModule {}
