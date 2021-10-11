import { NgModule } from "@angular/core";
import { SharedModule } from "@kling/client-shared";
import { CreateProblemComponent } from "./create-problem/create-problem.component";
import { ProblemEditorRoutingModule } from "./problem-editor-routing.module";

@NgModule({
	declarations: [CreateProblemComponent],
	imports: [SharedModule, ProblemEditorRoutingModule]
})
export class ProblemEditorModule {}
