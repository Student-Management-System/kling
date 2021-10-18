import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CollaborationComponent } from "./collaboration/collaboration.component";

const routes: Routes = [{ path: "", component: CollaborationComponent, pathMatch: "full" }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CollaborationRoutingModule {}
