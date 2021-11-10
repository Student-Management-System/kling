import { createAction, props } from "@ngrx/store";
import { AssignmentDto, CourseDto, GroupDto, UserDto } from "@student-mgmt/api-client";
import { SubmissionResultDto, VersionDto } from "@student-mgmt/exercise-submitter-api-client";

export const setUser = createAction("[User] Set User", props<{ user?: UserDto }>());

export const selectCourse = createAction("[Course] Select Course", props<{ courseId?: string }>());

export const loadCourses = createAction("[Course] Load Courses");

export const setCourses = createAction("[Course] Set Courses", props<{ courses: CourseDto[] }>());

export const loadAssignments = createAction(
	"[Assignment] Load Assignments",
	props<{ courseId: string }>()
);

export const setAssignments = createAction(
	"[Assignment] Set Assignments",
	props<{ assignments: AssignmentDto[] }>()
);

export const selectAssignment = createAction(
	"[Assignment] Select Assignment",
	props<{ assignmentId: string | null }>()
);

export const loadGroupOfAssignment = createAction(
	"[Assignment] Load Group of Assignment",
	props<{ courseId: string; assignmentId: string }>()
);

export const setGroupOfAssignment = createAction(
	"[Assignment] Set Group of Assignment",
	props<{ group?: GroupDto }>()
);

export const loadVersions = createAction("[Exercise Submitter] Load Versions");

export const setVersions = createAction(
	"[Exercise Submitter] Set Versions",
	props<{ versions: VersionDto[] }>()
);

export const setSubmissionResult = createAction(
	"[Exercise Submitter] Set SubmissionResult",
	props<{ submissionResult?: SubmissionResultDto }>()
);
