import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { IconModule } from "@kling/client/shared/components";
import { TranslateModule } from "@ngx-translate/core";
import { FileExplorerModule } from "../../file-explorer/file-explorer.module";
import { SideBarElementModule } from "../side-bar-element/side-bar-element.module";
import { WorkspaceSettingsModule } from "../workspace-settings/workspace-settings.module";
import { ExplorerComponent } from "./explorer.component";

@NgModule({
	declarations: [ExplorerComponent],
	imports: [
		CommonModule,
		IconModule,
		TranslateModule,
		MatMenuModule,
		MatButtonModule,
		FileExplorerModule,
		WorkspaceSettingsModule,
		SideBarElementModule
	],
	exports: [ExplorerComponent],
	providers: []
})
export class ExplorerModule {}
