import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AssignmentListComponent } from "./assignment-list/assignment-list.component";
import { AssignmentComponent } from "./assignment/assignment.component";
import { CoursesComponent } from "./courses/courses.component";
import { ExerciseSubmitterComponent } from "./exercise-submitter/exercise-submitter.component";

const routes: Routes = [
	{
		path: "",
		pathMatch: "full",
		component: ExerciseSubmitterComponent,
		children: [
			{
				path: "",
				pathMatch: "full",
				component: CoursesComponent
			},
			{
				path: "courses/:courseId",
				pathMatch: "full",
				component: AssignmentListComponent
			},
			{
				path: "courses/:courseId/assignments/:assignmentId",
				pathMatch: "full",
				component: AssignmentComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ExerciseSubmitterRoutingModule {}
