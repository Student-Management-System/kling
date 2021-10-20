import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { CreateProblemComponent } from "./create-problem/create-problem.component";
import { ProblemEditorRoutingModule } from "./problem-editor-routing.module";
import { TranslateModule } from "@ngx-translate/core";
import { MatSelectModule } from "@angular/material/select";
import { IconModule } from "@kling/client/shared/components";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
	declarations: [CreateProblemComponent],
	imports: [
		CommonModule,
		ProblemEditorRoutingModule,
		MatFormFieldModule,
		MatCardModule,
		MatSelectModule,
		TranslateModule,
		IconModule,
		ReactiveFormsModule,
		MatAutocompleteModule
	]
})
export class ProblemEditorModule {}
