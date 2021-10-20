import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
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
		MiddleClickModule
	],
	declarations: [FileTabsComponent, TabComponent],
	exports: [FileTabsComponent]
})
export class FileTabsModule {}
