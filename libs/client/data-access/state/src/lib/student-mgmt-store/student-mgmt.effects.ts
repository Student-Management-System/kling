import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AssignmentApi, UserApi } from "@student-mgmt/api-client";
import { filter, switchMap, map, withLatestFrom, catchError, of } from "rxjs";
import { AuthSelectors } from "../auth-store";
import * as StudentMgmtActions from "./student-mgmt.actions";

@Injectable()
export class StudentMgmtEffects {
	courseSelected$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(StudentMgmtActions.selectCourse),
			filter(action => !!action.courseId),
			switchMap(action => [
				StudentMgmtActions.loadAssignments({ courseId: action.courseId }),
				StudentMgmtActions.loadAssignmentGroups({ courseId: action.courseId })
			])
		);
	});

	loadAssignments$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(StudentMgmtActions.loadAssignments),
			switchMap(action => this.assignmentApi.getAssignmentsOfCourse(action.courseId)),
			map(assignments => StudentMgmtActions.setAssignments({ assignments })),
			catchError(_error => of(StudentMgmtActions.setAssignments({ assignments: [] })))
		);
	});

	loadAssignmentGroups$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(StudentMgmtActions.loadAssignmentGroups),
			withLatestFrom(this.store.select(AuthSelectors.selectUser)),
			switchMap(([action, user]) =>
				this.userApi.getGroupOfAllAssignments(user.id, action.courseId)
			),
			map(assignmentGroups => StudentMgmtActions.setAssignmentGroups({ assignmentGroups })),
			catchError(_error =>
				of(StudentMgmtActions.setAssignmentGroups({ assignmentGroups: [] }))
			)
		);
	});

	constructor(
		private readonly actions$: Actions,
		private readonly store: Store,
		private readonly assignmentApi: AssignmentApi,
		private readonly userApi: UserApi
	) {}
}
