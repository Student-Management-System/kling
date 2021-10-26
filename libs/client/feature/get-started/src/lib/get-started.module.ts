import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ActionComponent } from "./components/actions/action.component";
import { ActionsComponent } from "./components/actions/actions.component";
import { GetStartedComponent } from "./components/get-started/get-started.component";
import { RecentProjectsComponent } from "./components/recent-projects/recent-projects.component";
import { TranslateModule } from "@ngx-translate/core";
import { FileIconModule, IconModule } from "@kling/client/shared/components";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
	imports: [
		CommonModule,
		IconModule,
		FileIconModule,
		TranslateModule,
		MatFormFieldModule,
		MatInputModule,
		MatDividerModule,
		MatButtonModule
	],
	declarations: [GetStartedComponent, ActionsComponent, ActionComponent, RecentProjectsComponent],
	exports: [GetStartedComponent]
})
export class GetStartedModule {}
