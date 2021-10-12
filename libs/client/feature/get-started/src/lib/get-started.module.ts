import { NgModule } from "@angular/core";
import { SharedModule } from "@kling/client-shared";
import { GetStartedComponent } from "./components/get-started/get-started.component";
import { ActionsComponent } from "./components/actions/actions.component";
import { RecentProjectsComponent } from "./components/recent-projects/recent-projects.component";
import { ActionComponent } from "./components/actions/action.component";

@NgModule({
	imports: [SharedModule],
	declarations: [GetStartedComponent, ActionsComponent, ActionComponent, RecentProjectsComponent],
	exports: [GetStartedComponent]
})
export class GetStartedModule {}
