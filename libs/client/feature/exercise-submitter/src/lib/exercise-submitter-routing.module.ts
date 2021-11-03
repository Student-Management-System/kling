import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AssignmentListComponent } from "./assignment-list/assignment-list.component";
import { AssignmentComponent } from "./assignment/assignment.component";
import { CoursesComponent } from "./courses/courses.component";
import { ExerciseSubmitterComponent } from "./exercise-submitter/exercise-submitter.component";

const routes: Routes = [
	{
		path: "",
		component: ExerciseSubmitterComponent,
		pathMatch: "full",
		children: [
			{
				outlet: "es-inner",
				path: "courses/:courseId",
				component: AssignmentListComponent,
				pathMatch: "full"
			},
			{
				outlet: "es-inner",
				path: "courses/:courseId/assignments/:assignmentId",
				component: AssignmentComponent,
				pathMatch: "full"
			},
			{
				outlet: "es-inner",
				path: "",
				component: CoursesComponent,
				pathMatch: "full"
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ExerciseSubmitterRoutingModule {}
