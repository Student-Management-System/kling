import { NgModule, ModuleWithProviders, SkipSelf, Optional } from "@angular/core";
import { Configuration } from "./configuration";
import { HttpClient } from "@angular/common/http";

import { AdmissionStatusService } from "./api/admissionStatus.service";
import { AssessmentService } from "./api/assessment.service";
import { AssessmentAllocationService } from "./api/assessmentAllocation.service";
import { AssignmentService } from "./api/assignment.service";
import { AssignmentRegistrationService } from "./api/assignmentRegistration.service";
import { AuthenticationService } from "./api/authentication.service";
import { CourseService } from "./api/course.service";
import { CourseConfigService } from "./api/courseConfig.service";
import { CourseParticipantsService } from "./api/courseParticipants.service";
import { DefaultService } from "./api/default.service";
import { ExportService } from "./api/export.service";
import { GroupService } from "./api/group.service";
import { MailService } from "./api/mail.service";
import { NotificationService } from "./api/notification.service";
import { SubmissionService } from "./api/submission.service";
import { UserService } from "./api/user.service";

@NgModule({
	imports: [],
	declarations: [],
	exports: [],
	providers: []
})
export class ApiModule {
	public static forRoot(
		configurationFactory: () => Configuration
	): ModuleWithProviders<ApiModule> {
		return {
			ngModule: ApiModule,
			providers: [{ provide: Configuration, useFactory: configurationFactory }]
		};
	}

	constructor(@Optional() @SkipSelf() parentModule: ApiModule, @Optional() http: HttpClient) {
		if (parentModule) {
			throw new Error("ApiModule is already loaded. Import in your base AppModule only.");
		}
		if (!http) {
			throw new Error(
				"You need to import the HttpClientModule in your AppModule! \n" +
					"See also https://github.com/angular/angular/issues/20575"
			);
		}
	}
}
