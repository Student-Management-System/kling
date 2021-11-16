import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AssignmentApi, GroupDto, UserApi } from "@student-mgmt/api-client";
import { SubmissionApi } from "@student-mgmt/exercise-submitter-api-client";
import {
	catchError,
	combineLatest,
	filter,
	firstValueFrom,
	map,
	of,
	switchMap,
	tap,
	throwError,
	withLatestFrom
} from "rxjs";
import { StudentMgmtSelectors } from ".";
import * as StudentMgmtActions from "./student-mgmt.actions";

@Injectable()
export class StudentMgmtEffects {
	courseSelected$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(StudentMgmtActions.selectCourse),
			filter(action => !!action.courseId),
			switchMap(action => {
				return [
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					StudentMgmtActions.loadAssignments({ courseId: action.courseId! })
				];
			})
		);
	});

	assignmentSelected$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(StudentMgmtActions.selectAssignment),
			filter(action => !!action.assignmentId),
			withLatestFrom(
				this.store.select(StudentMgmtSelectors.user),
				this.store.select(StudentMgmtSelectors.selectedCourseId)
			),
			switchMap(async ([action, user, courseId]) => {
				if (!courseId || !user?.id) {
					console.error("assignmentSelected$ triggered without selectedCourseId");
					return undefined;
				}

				let group: GroupDto | undefined = undefined;

				try {
					group = await firstValueFrom(
						this.userApi.getGroupOfAssignment(user.id, courseId, action.assignmentId!)
					);
				} catch (error) {
					if (!(error instanceof HttpErrorResponse && error.status == 404)) {
						console.error(error);
					}
				}

				return group;
			}),
			map(group => StudentMgmtActions.setGroupOfAssignment({ group }))
		);
	});

	loadCourses$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(StudentMgmtActions.loadCourses),
			withLatestFrom(this.store.select(StudentMgmtSelectors.user)),
			switchMap(([_action, user]) => this.userApi.getCoursesOfUser(user!.id)),
			map(courses => StudentMgmtActions.setCourses({ courses })),
			catchError(_error => of(StudentMgmtActions.setCourses({ courses: [] })))
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

	loadVersions$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(StudentMgmtActions.loadVersions),
			withLatestFrom(
				this.store.select(StudentMgmtSelectors.user),
				this.store.select(StudentMgmtSelectors.selectedCourse),
				this.store.select(StudentMgmtSelectors.selectedAssignment),
				this.store.select(StudentMgmtSelectors.groupForSelectedAssignment)
			),
			switchMap(([_action, user, course, assignment, group]) =>
				this.submissionApi.listVersions(
					course!.id,
					assignment!.name,
					group?.name ?? user!.username
				)
			),
			map(versions => {
				return StudentMgmtActions.setVersions({ versions });
			}),
			catchError(error => {
				console.error(error);
				return of(StudentMgmtActions.setVersions({ versions: [] }));
			})
		);
	});

	constructor(
		private readonly actions$: Actions,
		private readonly store: Store,
		private readonly assignmentApi: AssignmentApi,
		private readonly userApi: UserApi,
		private readonly submissionApi: SubmissionApi
	) {}
}
