import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { StudentMgmtActions, StudentMgmtSelectors } from "@web-ide/client/data-access/state";
import { Store } from "@ngrx/store";
import { AssignmentDto, CourseDto } from "@student-mgmt/api-client";
import { ExerciseSubmitterService } from "../exercise-submitter.service";

export type SubmitInfo = {
	courseId: string;
	assignmentName: string;
	groupOrUsername: string;
};

@Component({
	selector: "web-ide-exercise-submitter",
	templateUrl: "./exercise-submitter.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseSubmitterComponent implements OnInit {
	user$ = this.store.select(StudentMgmtSelectors.user);
	courses$ = this.store.select(StudentMgmtSelectors.courses);
	assignments$ = this.store.select(StudentMgmtSelectors.assignments);
	assignment$ = this.store.select(StudentMgmtSelectors.selectedAssignment);
	course$ = this.store.select(StudentMgmtSelectors.selectedCourse);
	group$ = this.store.select(StudentMgmtSelectors.groupForSelectedAssignment);
	versions$ = this.store.select(StudentMgmtSelectors.versions);

	constructor(
		private readonly exerciseSubmitter: ExerciseSubmitterService,
		private readonly store: Store,
		private readonly route: ActivatedRoute,
		private readonly router: Router
	) {}

	ngOnInit(): void {
		if (!this.exerciseSubmitter.isInitialized) {
			const { course, assignment } = this.route.snapshot.queryParams;

			this.store.dispatch(StudentMgmtActions.loadCourses());

			if (course) {
				this.store.dispatch(StudentMgmtActions.selectCourse({ courseId: course }));
			}

			if (assignment) {
				this.store.dispatch(
					StudentMgmtActions.selectAssignment({ assignmentId: assignment })
				);
			}

			this.exerciseSubmitter.isInitialized = true;
		}
	}

	selectCourse(course: CourseDto | null): void {
		this.router.navigate([], {
			queryParams: {
				course: course?.id,
				assignment: undefined
			},
			queryParamsHandling: "merge",
			preserveFragment: true
		});

		this.store.dispatch(StudentMgmtActions.selectCourse({ courseId: course?.id }));
	}

	selectAssignment(assignment: AssignmentDto | null): void {
		this.router.navigate([], {
			queryParams: {
				assignment: assignment?.id
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
