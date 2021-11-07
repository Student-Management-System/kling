import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromStudentMgmt from "./student-mgmt.reducer";
import { selectCourses } from "../auth-store/auth.selectors";

export const selectStudentMgmtState = createFeatureSelector<fromStudentMgmt.State>(
	fromStudentMgmt.studentMgmtFeatureKey
);

export const selectedCourse = createSelector(
	selectStudentMgmtState,
	selectCourses,
	(state, courses) =>
		state.selectedCourseId ? courses.find(c => c.id === state.selectedCourseId) : null
);

export const assignments = createSelector(selectStudentMgmtState, state => state.assignments);

export const selectedAssignment = createSelector(selectStudentMgmtState, state =>
	state.selectedAssignmentId
		? state.assignments?.data.find(a => a.id === state.selectedAssignmentId)
		: null
);

export const groupForSelectedAssignment = createSelector(selectStudentMgmtState, state =>
	state.selectedAssignmentId ? state.assignmentGroups?.data[state.selectedAssignmentId] : null
);
