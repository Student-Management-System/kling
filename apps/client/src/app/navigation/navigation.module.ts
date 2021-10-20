import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule } from "@angular/router";
import { IconModule } from "@kling/client/shared/components";
import { TranslateModule } from "@ngx-translate/core";
import { NavigationComponent } from "./navigation.component";

@NgModule({
	declarations: [NavigationComponent],
	imports: [
		CommonModule,
		MatToolbarModule,
		MatMenuModule,
		MatListModule,
		MatSidenavModule,
		MatDividerModule,
		IconModule,
		RouterModule,
		TranslateModule
	],
	exports: [NavigationComponent]
})
export class NavigationModule {}
