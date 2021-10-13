import { NgModule } from "@angular/core";
import { SideBarSectionComponent } from "./components/side-bar-section/side-bar-section.component";
import { SideBarComponent } from "./components/side-bar/side-bar.component";
import { WorkspaceSettingsComponent } from "./components/workspace-settings/workspace-settings.component";
import { FileExplorerModule } from "./file-explorer/file-explorer.module";
import { ExplorerComponent } from "./components/explorer/explorer.component";
import { SideBarHeaderComponent } from "./components/side-bar-header/side-bar-header.component";
import { HistoryComponent } from "./components/history/history.component";
import { SharedModule } from "@kling/client-shared";
import { WorkspaceSettingsService } from "@kling/ide-services";

@NgModule({
	declarations: [
		SideBarComponent,
		SideBarSectionComponent,
		WorkspaceSettingsComponent,
		ExplorerComponent,
		SideBarHeaderComponent,
		HistoryComponent
	],
	imports: [SharedModule, FileExplorerModule],
	exports: [SideBarComponent],
	providers: [WorkspaceSettingsService]
})
export class SideBarModule {}
