import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
	FileSelectors,
	StudentMgmtActions,
	StudentMgmtSelectors
} from "@web-ide/client/data-access/state";
import { Store } from "@ngrx/store";
import { AssignmentDto, CourseDto } from "@student-mgmt/api-client";
import { ExerciseSubmitterService } from "../exercise-submitter.service";
import { combineLatest, firstValueFrom, map } from "rxjs";

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

	loading$ = combineLatest([
		this.store.select(StudentMgmtSelectors.courses),
		this.store.select(StudentMgmtSelectors.assignments)
	]).pipe(
		map(([courses, assignments]) => {
			return courses.isLoading || assignments.isLoading;
		})
	);

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

	async submit(event: SubmitInfo): Promise<void> {
		const { courseId, assignmentName, groupOrUsername } = event;
		const files = await firstValueFrom(this.store.select(FileSelectors.selectAllFiles));

		await this.exerciseSubmitter.createSubmission(
			courseId,
			assignmentName,
			groupOrUsername,
			files
		);
	}
}
