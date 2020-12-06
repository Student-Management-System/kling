import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WorkspaceComponent } from "./workspace/workspace.component";

const routes: Routes = [{ path: "", component: WorkspaceComponent, pathMatch: "full" }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class IdeRoutingModule {}
