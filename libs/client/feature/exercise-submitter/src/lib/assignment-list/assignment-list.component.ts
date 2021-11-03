import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AssignmentApi } from "@student-mgmt/api-client";

@Component({
	selector: "kling-assignment-list",
	templateUrl: "./assignment-list.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentListComponent {
	courseId = this.route.snapshot.params.courseId;
	assignments$ = this.assignmentApi.getAssignmentsOfCourse(this.courseId);

	constructor(
		private readonly route: ActivatedRoute,
		private readonly assignmentApi: AssignmentApi
	) {}
}
