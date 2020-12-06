import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProblemListComponent } from "./problem-list/problem-list.component";

const routes: Routes = [{ path: "", component: ProblemListComponent }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ProblemListRoutingModule {}
