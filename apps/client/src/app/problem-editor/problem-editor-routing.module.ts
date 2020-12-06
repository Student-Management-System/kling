import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CreateProblemComponent } from "./create-problem/create-problem.component";

const routes: Routes = [{ path: "create", component: CreateProblemComponent, pathMatch: "full" }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ProblemEditorRoutingModule {}
