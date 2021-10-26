import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import { WorkspaceSettingsComponent } from "./workspace-settings.component";

@NgModule({
	declarations: [WorkspaceSettingsComponent],
	imports: [CommonModule, TranslateModule, MatSelectModule, MatOptionModule],
	exports: [WorkspaceSettingsComponent]
})
export class WorkspaceSettingsModule {}
