export * from "./admissionStatus.service";
import { AdmissionStatusService } from "./admissionStatus.service";
export * from "./assessment.service";
import { AssessmentService } from "./assessment.service";
export * from "./assessmentAllocation.service";
import { AssessmentAllocationService } from "./assessmentAllocation.service";
export * from "./assignment.service";
import { AssignmentService } from "./assignment.service";
export * from "./assignmentRegistration.service";
import { AssignmentRegistrationService } from "./assignmentRegistration.service";
export * from "./authentication.service";
import { AuthenticationService } from "./authentication.service";
export * from "./course.service";
import { CourseService } from "./course.service";
export * from "./courseConfig.service";
import { CourseConfigService } from "./courseConfig.service";
export * from "./courseParticipants.service";
import { CourseParticipantsService } from "./courseParticipants.service";
export * from "./default.service";
import { DefaultService } from "./default.service";
export * from "./export.service";
import { ExportService } from "./export.service";
export * from "./group.service";
import { GroupService } from "./group.service";
export * from "./mail.service";
import { MailService } from "./mail.service";
export * from "./notification.service";
import { NotificationService } from "./notification.service";
export * from "./submission.service";
import { SubmissionService } from "./submission.service";
export * from "./user.service";
import { UserService } from "./user.service";
export const APIS = [
	AdmissionStatusService,
	AssessmentService,
	AssessmentAllocationService,
	AssignmentService,
	AssignmentRegistrationService,
	AuthenticationService,
	CourseService,
	CourseConfigService,
	CourseParticipantsService,
	DefaultService,
	ExportService,
	GroupService,
	MailService,
	NotificationService,
	SubmissionService,
	UserService
];
