import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromStudentMgmt from "./student-mgmt.reducer";

export const selectStudentMgmtState = createFeatureSelector<fromStudentMgmt.State>(
	fromStudentMgmt.studentMgmtFeatureKey
);

export const user = createSelector(selectStudentMgmtState, state => state.user);

export const courses = createSelector(selectStudentMgmtState, state => state.courses);

export const selectedCourse = createSelector(selectStudentMgmtState, courses, (state, courses) =>
	state.selectedCourseId ? courses.data.find(c => c.id === state.selectedCourseId) : null
);

export const selectedCourseId = createSelector(
	selectStudentMgmtState,
	state => state.selectedCourseId
);

export const assignments = createSelector(selectStudentMgmtState, state => state.assignments);

export const selectedAssignment = createSelector(selectStudentMgmtState, state =>
	state.selectedAssignmentId
		? state.assignments?.data.find(a => a.id === state.selectedAssignmentId)
		: null
);

export const groupForSelectedAssignment = createSelector(selectStudentMgmtState, state =>
	state.selectedAssignmentId ? state.groupForAssignment : undefined
);

export const versions = createSelector(selectStudentMgmtState, state => state.versions);

export const submissionResult = createSelector(
	selectStudentMgmtState,
	state => state.submissionResult
);
