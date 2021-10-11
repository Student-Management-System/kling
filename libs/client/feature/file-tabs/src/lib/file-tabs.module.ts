import { NgModule } from "@angular/core";
import { SharedModule } from "@kling/client-shared";
import { FileTabsComponent } from "./file-tabs/file-tabs.component";
import { TabComponent } from "./tab/tab.component";

@NgModule({
	imports: [SharedModule],
	declarations: [FileTabsComponent, TabComponent],
	exports: [FileTabsComponent]
})
export class FileTabsModule {}
