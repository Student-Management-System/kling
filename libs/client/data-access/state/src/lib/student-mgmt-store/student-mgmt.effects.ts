import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AssignmentApi, GroupDto, UserApi } from "@student-mgmt/api-client";
import { SubmissionApi, VersionDto } from "@student-mgmt/exercise-submitter-api-client";
import { catchError, filter, firstValueFrom, map, of, switchMap, withLatestFrom } from "rxjs";
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
					throw new Error(
						"assignmentSelected$ triggered without selectedCourseId or user"
					);
				}

				const [assignment, group] = await Promise.all([
					firstValueFrom(
						this.assignmentApi.getAssignmentById(courseId, action.assignmentId!)
					),
					this.tryLoadGroup(user.id, courseId, action.assignmentId!)
				]);

				return { assignment, group };
			}),
			map(assignmentAndGroup => StudentMgmtActions.setAssignmentAndGroup(assignmentAndGroup))
		);
	});

	setAssignmentAndGroup$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(StudentMgmtActions.setAssignmentAndGroup),
			filter(action => !!action.assignment),
			map(() => StudentMgmtActions.loadVersions())
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
				this.tryLoadVersions(course!.id, assignment!.name, group?.name ?? user!.username)
			),
			map(versions => StudentMgmtActions.setVersions({ versions }))
		);
	});

	constructor(
		private readonly actions$: Actions,
		private readonly store: Store,
		private readonly assignmentApi: AssignmentApi,
		private readonly userApi: UserApi,
		private readonly submissionApi: SubmissionApi
	) {}

	private async tryLoadGroup(
		userId: string,
		courseId: string,
		assignmentId: string
	): Promise<GroupDto | undefined> {
		let group: GroupDto | undefined = undefined;

		try {
			group = await firstValueFrom(
				this.userApi.getGroupOfAssignment(userId, courseId, assignmentId)
			);
		} catch (error) {
			// 404 error is expected, if user has no group for this assignment
			if (!(error instanceof HttpErrorResponse && error.status == 404)) {
				console.error(error);
			}
		}

		return group;
	}

	private async tryLoadVersions(
		courseId: string,
		assignmentName: string,
		groupOrUsername: string
	): Promise<VersionDto[]> {
		let versions: VersionDto[] = [];

		try {
			versions = await firstValueFrom(
				this.submissionApi.listVersions(courseId, assignmentName, groupOrUsername)
			);
		} catch (error) {
			console.error();
		}

		return versions;
	}
}
