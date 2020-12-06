import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { ActivityBarComponent } from "./components/activity-bar/activity-bar.component";

@NgModule({
	declarations: [ActivityBarComponent],
	imports: [SharedModule],
	exports: [ActivityBarComponent]
})
export class ActivityBarModule {}
