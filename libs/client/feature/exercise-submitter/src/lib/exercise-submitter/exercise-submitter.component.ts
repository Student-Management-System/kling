import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
	AuthSelectors,
	StudentMgmtActions,
	StudentMgmtSelectors
} from "@kling/client/data-access/state";
import { UnsubscribeOnDestroy } from "@kling/client/shared/components";
import { Store } from "@ngrx/store";
import { AssignmentDto, CourseDto } from "@student-mgmt/api-client";

@Component({
	selector: "kling-exercise-submitter",
	templateUrl: "./exercise-submitter.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseSubmitterComponent extends UnsubscribeOnDestroy implements OnInit {
	user$ = this.store.select(AuthSelectors.selectUser);
	courses$ = this.store.select(AuthSelectors.selectCourses);
	assignments$ = this.store.select(StudentMgmtSelectors.assignments);
	assignment$ = this.store.select(StudentMgmtSelectors.selectedAssignment);
	course$ = this.store.select(StudentMgmtSelectors.selectedCourse);
	group$ = this.store.select(StudentMgmtSelectors.groupForSelectedAssignment);

	private latestCourseId: string | null = null;
	private latestAssignmentId: string | null = null;

	constructor(
		private readonly store: Store,
		private readonly route: ActivatedRoute,
		private readonly router: Router
	) {
		super();
	}

	ngOnInit(): void {
		this.subs.sink = this.route.queryParams.subscribe(({ courseId, assignmentId }) => {
			if (courseId !== this.latestCourseId) {
				this.store.dispatch(StudentMgmtActions.selectCourse({ courseId }));
			}

			if (assignmentId !== this.latestAssignmentId) {
				this.store.dispatch(StudentMgmtActions.selectAssignment({ assignmentId }));
			}

			this.latestCourseId = courseId;
			this.latestAssignmentId = assignmentId;
		});
	}

	selectCourse(course: CourseDto | null): void {
		this.router.navigate([], {
			queryParams: {
				courseId: course?.id
			},
			queryParamsHandling: "merge",
			preserveFragment: true
		});
	}

	selectAssignment(assignment: AssignmentDto | null): void {
		this.router.navigate([], {
			queryParams: {
				assignmentId: assignment?.id
			},
			queryParamsHandling: "merge",
			preserveFragment: true
		});
	}
}
