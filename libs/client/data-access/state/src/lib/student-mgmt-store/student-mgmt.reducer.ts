import { createReducer, on } from "@ngrx/store";
import { AssignmentDto, GroupDto } from "@student-mgmt/api-client";
import * as StudentMgmtActions from "./student-mgmt.actions";

export const studentMgmtFeatureKey = "student-mgmt";

export interface State {
	selectedCourseId: string | null;
	selectedAssignmentId: string | null;
	assignments: {
		data: AssignmentDto[];
		isLoading: boolean;
	};
	assignmentGroups: {
		data: Record<string, GroupDto>;
		isLoading: boolean;
	};
}

const initialState: State = {
	selectedCourseId: null,
	assignments: {
		data: [],
		isLoading: false
	},
	selectedAssignmentId: null,
	assignmentGroups: {
		data: {},
		isLoading: false
	}
};

export const reducer = createReducer(
	initialState,
	on(StudentMgmtActions.selectCourse, (state, action) => ({
		...initialState,
		selectedCourseId: action.courseId
	})),
	on(StudentMgmtActions.selectAssignment, (state, action) => ({
		...state,
		selectedAssignmentId: action.assignmentId
	})),
	on(StudentMgmtActions.setAssignments, (state, action) => ({
		...state,
		assignments: {
			data: action.assignments,
			isLoading: false
		}
	})),
	on(StudentMgmtActions.loadAssignments, state => ({
		...state,
		assignments: {
			data: [],
			isLoading: true
		}
	})),
	on(StudentMgmtActions.loadAssignmentGroups, state => ({
		...state,
		assignmentGroups: {
			data: {},
			isLoading: true
		}
	})),
	on(StudentMgmtActions.setAssignmentGroups, (state, action) => {
		const data = {};
		action.assignmentGroups.forEach(t => (data[t.assignment.id] = t.group));
		return {
			...state,
			assignmentGroups: {
				data,
				isLoading: false
			}
		};
	})
);
