import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { IconModule } from "@web-ide/client/shared/components";
import { TranslateModule } from "@ngx-translate/core";
import { AssignmentListComponent } from "./assignment-list/assignment-list.component";
import { AssignmentComponent } from "./assignment/assignment.component";
import { CoursesComponent } from "./courses/courses.component";
import { ExerciseSubmitterService } from "./exercise-submitter.service";
import { ExerciseSubmitterComponent } from "./exercise-submitter/exercise-submitter.component";
import { SemesterPipeModule } from "@web-ide/client-shared";
import { ApiModule, Configuration } from "@student-mgmt/exercise-submitter-api-client";
import { AuthService } from "@web-ide/client-auth";
import { getEnvVariableOrThrow } from "@web-ide/client-environments";
import { VersionListModule } from "./version-list/version-list.component";
import { SubmissionResultModule } from "./submission-result/submission-result.component";

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
		),
		VersionListModule,
		SubmissionResultModule
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
