import { createReducer, on } from "@ngrx/store";
import { AssignmentDto, CourseDto, GroupDto, UserDto } from "@student-mgmt/api-client";
import { SubmissionResultDto, VersionDto } from "@student-mgmt/exercise-submitter-api-client";
import { Loadable, setLoadable } from "../interfaces";
import * as StudentMgmtActions from "./student-mgmt.actions";

export const studentMgmtFeatureKey = "student-mgmt";

export type State = {
	user?: UserDto;
	selectedCourseId?: string | null;
	assignment?: AssignmentDto | null;
	group?: GroupDto | null;
	courses: Loadable<CourseDto[]>;
	assignments: Loadable<AssignmentDto[]>;
	versions: Loadable<VersionDto[]>;
	submissionResult?: SubmissionResultDto;
};

function createInitialState(): State {
	const storedToken = localStorage.getItem("studentMgmtToken");
	let user: UserDto | undefined = undefined;

	if (storedToken) {
		const parsedToken: { user: UserDto; expiration?: string } = JSON.parse(storedToken);

		if (parsedToken.expiration) {
			const expirationDate = new Date(parsedToken.expiration);
			if (expirationDate > new Date()) {
				user = parsedToken.user;
			} else {
				localStorage.removeItem("studentMgmtToken");
			}
		} else {
			user = parsedToken.user;
		}
	}

	return {
		user,
		courses: setLoadable([]),
		assignments: setLoadable([]),
		versions: setLoadable([])
	};
}

export const reducer = createReducer(
	createInitialState(),
	on(
		StudentMgmtActions.setUser,
		(_state, action): State => ({
			...createInitialState(),
			user: action.user
		})
	),
	on(
		StudentMgmtActions.selectCourse,
		(state, action): State => ({
			...createInitialState(),
			user: state.user,
			courses: state.courses,
			selectedCourseId: action.courseId
		})
	),
	on(
		StudentMgmtActions.loadCourses,
		(state): State => ({
			...state,
			courses: setLoadable([], true)
		})
	),
	on(
		StudentMgmtActions.setCourses,
		(state, action): State => ({
			...state,
			courses: setLoadable(action.courses)
		})
	),
	on(
		StudentMgmtActions.selectAssignment,
		(state, _action): State => ({
			...state,
			assignment: null,
			group: null,
			submissionResult: undefined,
			versions: setLoadable([])
		})
	),
	on(
		StudentMgmtActions.setAssignments,
		(state, action): State => ({
			...state,
			assignments: setLoadable(action.assignments)
		})
	),
	on(
		StudentMgmtActions.loadAssignments,
		(state): State => ({
			...state,
			assignments: setLoadable([], true)
		})
	),
	on(
		StudentMgmtActions.setAssignmentAndGroup,
		(state, action): State => ({
			...state,
			assignment: action.assignment,
			group: action.group
		})
	),
	on(
		StudentMgmtActions.loadVersions,
		(state): State => ({
			...state,
			versions: setLoadable([], true)
		})
	),
	on(
		StudentMgmtActions.setVersions,
		(state, action): State => ({
			...state,
			versions: setLoadable(action.versions)
		})
	),
	on(
		StudentMgmtActions.setSubmissionResult,
		(state, action): State => ({
			...state,
			submissionResult: action.submissionResult
		})
	)
);
