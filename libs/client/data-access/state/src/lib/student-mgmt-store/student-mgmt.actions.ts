import { createAction, props } from "@ngrx/store";
import { AssignmentDto, AssignmentGroupTuple, CourseDto, UserDto } from "@student-mgmt/api-client";
import { VersionDto } from "@student-mgmt/exercise-submitter-api-client";

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

export const loadAssignmentGroups = createAction(
	"[Assignment] Load Assignment Groups",
	props<{ courseId: string }>()
);

export const setAssignmentGroups = createAction(
	"[Assignment] Set Assignment Groups",
	props<{ assignmentGroups: AssignmentGroupTuple[] }>()
);

export const loadVersions = createAction("[Exercise Submitter] Load Versions");

export const setVersions = createAction(
	"[Exercise Submitter] Set Versions",
	props<{ versions: VersionDto[] }>()
);
