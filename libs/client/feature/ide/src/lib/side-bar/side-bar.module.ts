import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IconModule } from "@web-ide/client/shared/components";
import { ExplorerModule } from "./components/explorer/explorer.module";
import { HistoryModule } from "./components/history/history.module";
import { SideBarComponent } from "./components/side-bar/side-bar.component";

@NgModule({
	declarations: [SideBarComponent],
	imports: [CommonModule, ExplorerModule, HistoryModule, IconModule],
	exports: [SideBarComponent]
})
export class SideBarModule {}
