import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { TranslateModule } from "@ngx-translate/core";
import { AssignmentDto, CourseDto } from "@student-mgmt/api-client";
import { ApiModule, Configuration } from "@student-mgmt/exercise-submitter-api-client";
import { AuthService } from "@web-ide/client-auth";
import { getEnvVariableOrThrow } from "@web-ide/client-environments";
import {
	FileSelectors,
	StudentMgmtActions,
	StudentMgmtSelectors
} from "@web-ide/client/data-access/state";
import { IconModule } from "@web-ide/client/shared/components";
import { combineLatest, firstValueFrom, map } from "rxjs";
import { AssignmentListModule } from "./assignment-list/assignment-list.component";
import { AssignmentViewComponentModule } from "./assignment-view/assignment-view.component";
import { VersionListModule } from "./assignment-view/version-list/version-list.component";
import { CoursesComponentModule } from "./courses/courses.component";
import { ExerciseSubmitterService } from "./exercise-submitter.service";

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
				assignment: undefined,
				showVersions: undefined
			},
			queryParamsHandling: "merge",
			preserveFragment: true
		});

		this.store.dispatch(StudentMgmtActions.selectCourse({ courseId: course?.id }));
	}

	selectAssignment(assignment: AssignmentDto | null): void {
		this.router.navigate([], {
			queryParams: {
				assignment: assignment?.id,
				showVersions: undefined
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

@NgModule({
	imports: [
		CommonModule,
		IconModule,
		TranslateModule,
		MatProgressSpinnerModule,
		ApiModule.forRoot(
			() =>
				new Configuration({
					accessToken: (): string => AuthService.getAccessToken() ?? "",
					basePath: getEnvVariableOrThrow("EXERCISE_SUBMITTER_BASE_PATH")
				})
		),
		AssignmentViewComponentModule,
		AssignmentListModule,
		VersionListModule,
		CoursesComponentModule
	],
	declarations: [ExerciseSubmitterComponent],
	exports: [ExerciseSubmitterComponent],
	providers: [ExerciseSubmitterService]
})
export class ExerciseSubmitterModule {}
