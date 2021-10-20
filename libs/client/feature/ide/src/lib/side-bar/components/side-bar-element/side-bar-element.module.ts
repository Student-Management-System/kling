import { NgModule } from "@angular/core";
import { IconModule } from "@kling/client/shared/components";
import { SideBarHeaderComponent } from "./side-bar-header/side-bar-header.component";
import { SideBarSectionComponent } from "./side-bar-section/side-bar-section.component";

@NgModule({
	declarations: [SideBarHeaderComponent, SideBarSectionComponent],
	imports: [IconModule],
	exports: [SideBarHeaderComponent, SideBarSectionComponent],
	providers: []
})
export class SideBarElementModule {}
