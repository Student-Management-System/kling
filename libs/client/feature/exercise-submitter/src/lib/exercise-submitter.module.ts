import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { CoursesComponent } from "./courses/courses.component";
import { ExerciseSubmitterRoutingModule } from "./exercise-submitter-routing.module";
import { ExerciseSubmitterService } from "./exercise-submitter.service";
import { ExerciseSubmitterComponent } from "./exercise-submitter/exercise-submitter.component";
import { AssignmentListComponent } from "./assignment-list/assignment-list.component";
import { AssignmentComponent } from "./assignment/assignment.component";

@NgModule({
	imports: [CommonModule, ExerciseSubmitterRoutingModule, TranslateModule],
	declarations: [
		ExerciseSubmitterComponent,
		CoursesComponent,
		AssignmentListComponent,
		AssignmentComponent
	],
	exports: [ExerciseSubmitterComponent],
	providers: [ExerciseSubmitterService]
})
export class ExerciseSubmitterModule {}
