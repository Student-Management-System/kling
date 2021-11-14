import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TranslateModule } from "@ngx-translate/core";
import { ApiModule, Configuration } from "@student-mgmt/exercise-submitter-api-client";
import { AuthService } from "@web-ide/client-auth";
import { getEnvVariableOrThrow } from "@web-ide/client-environments";
import { IconModule } from "@web-ide/client/shared/components";
import { AssignmentListModule } from "./assignment-list/assignment-list.component";
import { CoursesComponentModule } from "./courses/courses.component";
import { ExerciseSubmitterService } from "./exercise-submitter.service";
import { ExerciseSubmitterComponent } from "./exercise-submitter/exercise-submitter.component";
import { VersionListModule } from "./version-list/version-list.component";

@NgModule({
	imports: [
		CommonModule,
		IconModule,
		TranslateModule,
		MatProgressSpinnerModule,
		ApiModule.forRoot(
			() =>
				new Configuration({
					accessToken: (): string => AuthService.getAccessToken() ?? "",
					basePath: getEnvVariableOrThrow("EXERCISE_SUBMITTER_BASE_PATH")
				})
		),
		AssignmentListModule,
		VersionListModule,
		CoursesComponentModule
	],
	declarations: [ExerciseSubmitterComponent],
	exports: [ExerciseSubmitterComponent],
	providers: [ExerciseSubmitterService]
})
export class ExerciseSubmitterModule {}
