import { NgModule } from "@angular/core";
import { AngularSplitModule } from "angular-split";
import { SharedModule } from "../shared/shared.module";
import { ActivityBarModule } from "./activity-bar/activity-bar.module";
import { EditorModule } from "./editor/editor.module";
import { FeaturePanelModule } from "./feature-panel/feature-panel.module";
import { IdeRoutingModule } from "./ide-routing.module";
import { WorkspaceSettingsService } from "./services/workspace-settings.service";
import { SideBarModule } from "./side-bar/side-bar.module";
import { WorkspaceComponent } from "./workspace/workspace.component";

@NgModule({
	declarations: [WorkspaceComponent],
	imports: [
		SharedModule,
		IdeRoutingModule,
		ActivityBarModule,
		SideBarModule,
		EditorModule,
		FeaturePanelModule,
		AngularSplitModule
	],
	providers: [WorkspaceSettingsService],
	exports: []
})
export class IdeModule {}
