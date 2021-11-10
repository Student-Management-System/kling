import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { IconModule } from "@web-ide/client/shared/components";
import { ActivityBarComponent } from "./components/activity-bar/activity-bar.component";

@NgModule({
	declarations: [ActivityBarComponent],
	imports: [CommonModule, IconModule, MatTooltipModule, MatButtonModule],
	exports: [ActivityBarComponent]
})
export class ActivityBarModule {}
