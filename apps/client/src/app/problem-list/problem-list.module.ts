import { NgModule } from "@angular/core";
import { ProblemListRoutingModule } from "./problem-list-routing.module";
import { ProblemListComponent } from "./problem-list/problem-list.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
	declarations: [ProblemListComponent],
	imports: [SharedModule, ProblemListRoutingModule]
})
export class ProblemListModule {}
