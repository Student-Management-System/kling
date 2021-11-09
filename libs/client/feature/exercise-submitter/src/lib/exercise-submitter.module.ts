import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { IconModule } from "@kling/client/shared/components";
import { TranslateModule } from "@ngx-translate/core";
import { AssignmentListComponent } from "./assignment-list/assignment-list.component";
import { AssignmentComponent } from "./assignment/assignment.component";
import { CoursesComponent } from "./courses/courses.component";
import { ExerciseSubmitterService } from "./exercise-submitter.service";
import { ExerciseSubmitterComponent } from "./exercise-submitter/exercise-submitter.component";
import { SemesterPipeModule } from "@kling/client-shared";
import { ApiModule, Configuration } from "@student-mgmt/exercise-submitter-api-client";
import { AuthService } from "@kling/client-auth";
import { getEnvVariableOrThrow } from "@kling/client-environments";

@NgModule({
	imports: [
		CommonModule,
		IconModule,
		TranslateModule,
		MatProgressSpinnerModule,
		SemesterPipeModule,
		ApiModule.forRoot(
			() =>
				new Configuration({
					accessToken: (): string => AuthService.getAccessToken() ?? "",
					basePath: getEnvVariableOrThrow("EXERCISE_SUBMITTER_BASE_PATH")
				})
		)
	],
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
