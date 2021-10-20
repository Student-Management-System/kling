import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { IconModule } from "@kling/client/shared/components";
import { ActivityBarComponent } from "./components/activity-bar/activity-bar.component";

@NgModule({
	declarations: [ActivityBarComponent],
	imports: [CommonModule, IconModule, MatTooltipModule],
	exports: [ActivityBarComponent]
})
export class ActivityBarModule {}
