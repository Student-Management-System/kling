import { NgModule } from "@angular/core";
import { SharedModule } from "@kling/client-shared";
import { ProblemListRoutingModule } from "./problem-list-routing.module";
import { ProblemListComponent } from "./problem-list/problem-list.component";

@NgModule({
	declarations: [ProblemListComponent],
	imports: [SharedModule, ProblemListRoutingModule]
})
export class ProblemListModule {}
