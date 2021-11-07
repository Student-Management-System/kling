import { createAction, props } from "@ngrx/store";
import { AssignmentDto, AssignmentGroupTuple } from "@student-mgmt/api-client";

export const selectCourse = createAction(
	"[Course] Select Course",
	props<{ courseId: string | null }>()
);

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
