import { createReducer, on } from "@ngrx/store";
import { AssignmentDto, CourseDto, GroupDto, UserDto } from "@student-mgmt/api-client";
import { VersionDto } from "@student-mgmt/exercise-submitter-api-client";
import { Loadable, setLoadable } from "../interfaces";
import * as StudentMgmtActions from "./student-mgmt.actions";

export const studentMgmtFeatureKey = "student-mgmt";

export type State = {
	user?: UserDto;
	selectedCourseId?: string | null;
	selectedAssignmentId?: string | null;
	courses: Loadable<CourseDto[]>;
	assignments: Loadable<AssignmentDto[]>;
	assignmentGroups: Loadable<Record<string, GroupDto>>;
	versions: Loadable<VersionDto[]>;
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
		assignmentGroups: setLoadable({}),
		versions: setLoadable([])
	};
}

export const reducer = createReducer(
	createInitialState(),
	on(StudentMgmtActions.setUser, (_state, action) => ({
		...createInitialState(),
		user: action.user
	})),
	on(StudentMgmtActions.selectCourse, (state, action) => ({
		...createInitialState(),
		user: state.user,
		courses: state.courses,
		selectedCourseId: action.courseId
	})),
	on(StudentMgmtActions.loadCourses, state => ({
		...state,
		courses: setLoadable([], true)
	})),
	on(StudentMgmtActions.setCourses, (state, action) => ({
		...state,
		courses: setLoadable(action.courses)
	})),
	on(StudentMgmtActions.selectAssignment, (state, action) => ({
		...state,
		selectedAssignmentId: action.assignmentId,
		versions: setLoadable([])
	})),
	on(StudentMgmtActions.setAssignments, (state, action) => ({
		...state,
		assignments: setLoadable(action.assignments)
	})),
	on(StudentMgmtActions.loadAssignments, state => ({
		...state,
		assignments: setLoadable([], true)
	})),
	on(StudentMgmtActions.loadAssignmentGroups, state => ({
		...state,
		assignmentGroups: setLoadable({}, true)
	})),
	on(StudentMgmtActions.setAssignmentGroups, (state, action) => {
		const assignmentGroups: Record<string, GroupDto> = {};
		action.assignmentGroups.forEach(t => (assignmentGroups[t.assignment.id] = t.group));
		return {
			...state,
			assignmentGroups: setLoadable(assignmentGroups)
		};
	}),
	on(StudentMgmtActions.loadVersions, state => ({
		...state,
		versions: setLoadable([], true)
	})),
	on(StudentMgmtActions.setVersions, (state, action) => ({
		...state,
		versions: setLoadable(action.versions)
	}))
);
