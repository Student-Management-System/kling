import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IconModule } from "@web-ide/client/shared/components";
import { SideBarHeaderComponent } from "./side-bar-header/side-bar-header.component";
import { SideBarSectionComponent } from "./side-bar-section/side-bar-section.component";

@NgModule({
	declarations: [SideBarHeaderComponent, SideBarSectionComponent],
	imports: [CommonModule, IconModule],
	exports: [SideBarHeaderComponent, SideBarSectionComponent],
	providers: []
})
export class SideBarElementModule {}
