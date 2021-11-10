import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { IconModule } from "@web-ide/client/shared/components";
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
		MatTooltipModule,
		FileExplorerModule,
		WorkspaceSettingsModule,
		SideBarElementModule
	],
	exports: [ExplorerComponent],
	providers: []
})
export class ExplorerModule {}
