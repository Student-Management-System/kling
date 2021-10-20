import { NgModule } from "@angular/core";
import { SideBarElementModule } from "../side-bar-element/side-bar-element.module";
import { HistoryComponent } from "./history.component";

@NgModule({
	declarations: [HistoryComponent],
	imports: [SideBarElementModule],
	exports: [HistoryComponent]
})
export class HistoryModule {}
