import { NgModule } from "@angular/core";
import { ProblemEditorRoutingModule } from "./problem-editor-routing.module";
import { SharedModule } from "../shared/shared.module";
import { CreateProblemComponent } from "./create-problem/create-problem.component";

@NgModule({
	declarations: [CreateProblemComponent],
	imports: [SharedModule, ProblemEditorRoutingModule]
})
export class ProblemEditorModule {}
