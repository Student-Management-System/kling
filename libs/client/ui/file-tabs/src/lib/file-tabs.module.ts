import { NgModule } from "@angular/core";
import { FileTabsComponent } from "./file-tabs/file-tabs.component";
import { TabComponent } from "./tab/tab.component";
import { SharedModule } from "../../../../../../apps/client/src/app/shared/shared.module";

@NgModule({
	imports: [SharedModule],
	declarations: [FileTabsComponent, TabComponent],
	exports: [FileTabsComponent]
})
export class FileTabsModule {}
