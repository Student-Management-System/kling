import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { StudentMgmtActions, StudentMgmtSelectors } from "@kling/client/data-access/state";
import { UnsubscribeOnDestroy } from "@kling/client/shared/components";
import { Store } from "@ngrx/store";
import { AssignmentDto, CourseDto } from "@student-mgmt/api-client";
import { firstValueFrom } from "rxjs";
import { ExerciseSubmitterService } from "../exercise-submitter.service";

export type SubmitInfo = {
	courseId: string;
	assignmentName: string;
	groupOrUsername: string;
};

@Component({
	selector: "kling-exercise-submitter",
	templateUrl: "./exercise-submitter.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseSubmitterComponent extends UnsubscribeOnDestroy implements OnInit {
	user$ = this.store.select(StudentMgmtSelectors.user);
	courses$ = this.store.select(StudentMgmtSelectors.courses);
	assignments$ = this.store.select(StudentMgmtSelectors.assignments);
	assignment$ = this.store.select(StudentMgmtSelectors.selectedAssignment);
	course$ = this.store.select(StudentMgmtSelectors.selectedCourse);
	group$ = this.store.select(StudentMgmtSelectors.groupForSelectedAssignment);
	versions$ = this.store.select(StudentMgmtSelectors.versions);

	private latestCourseId: string | null = null;
	private latestAssignmentId: string | null = null;

	constructor(
		private readonly exerciseSubmitter: ExerciseSubmitterService,
		private readonly store: Store,
		private readonly route: ActivatedRoute,
		private readonly router: Router
	) {
		super();
	}

	async ngOnInit(): Promise<void> {
		const { course, assignment } = this.route.snapshot.params;
		const state = await firstValueFrom(
			this.store.select(StudentMgmtSelectors.selectStudentMgmtState)
		);

		if (state.selectedCourseId !== course) {
			this.store.dispatch(StudentMgmtActions.loadCourses());
			this.store.dispatch(StudentMgmtActions.selectCourse({ courseId: course }));
		}

		if (course) {
			this.store.dispatch(StudentMgmtActions.selectCourse({ courseId: course }));
		}

		if (assignment) {
			this.store.dispatch(StudentMgmtActions.selectAssignment({ assignmentId: assignment }));
		}
	}

	selectCourse(course: CourseDto | null): void {
		this.router.navigate([], {
			queryParams: {
				courseId: course?.id,
				assignmentId: undefined
			},
			queryParamsHandling: "merge",
			preserveFragment: true
		});

		this.store.dispatch(StudentMgmtActions.selectCourse({ courseId: course?.id ?? null }));
	}

	selectAssignment(assignment: AssignmentDto | null): void {
		this.router.navigate([], {
			queryParams: {
				assignmentId: assignment?.id
			},
			queryParamsHandling: "merge",
			preserveFragment: true
		});

		this.store.dispatch(
			StudentMgmtActions.selectAssignment({ assignmentId: assignment?.id ?? null })
		);
	}

	submit(event: SubmitInfo): void {
		const { courseId, assignmentName, groupOrUsername } = event;
		this.exerciseSubmitter
			.createSubmission(courseId, assignmentName, groupOrUsername)
			.subscribe({
				next: result => {
					console.log(result);
				},
				error: error => {
					console.log(error);
				}
			});
	}
}
