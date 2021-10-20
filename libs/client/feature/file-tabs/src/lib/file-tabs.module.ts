import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MiddleClickModule, ProgrammingLanguageModule } from "@kling/client-shared";
import { FileIconModule, IconModule } from "@kling/client/shared/components";
import { FileTabsComponent } from "./file-tabs/file-tabs.component";
import { TabComponent } from "./tab/tab.component";

@NgModule({
	imports: [
		CommonModule,
		IconModule,
		FileIconModule,
		ProgrammingLanguageModule,
		MiddleClickModule,
		MatButtonModule
	],
	declarations: [FileTabsComponent, TabComponent],
	exports: [FileTabsComponent]
})
export class FileTabsModule {}
