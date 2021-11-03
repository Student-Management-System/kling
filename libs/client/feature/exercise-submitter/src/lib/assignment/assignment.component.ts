import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthSelectors } from "@kling/client/data-access/state";
import { Store } from "@ngrx/store";
import { AssignmentApi, GroupDto, UserApi } from "@student-mgmt/api-client";
import { firstValueFrom, Observable } from "rxjs";

@Component({
	selector: "kling-assignment",
	templateUrl: "./assignment.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentComponent implements OnInit {
	courseId = this.route.snapshot.params.courseId;
	assignmentId = this.route.snapshot.params.assignmentId;
	userId!: string;

	user$ = this.store.select(AuthSelectors.selectUser);
	assignment$ = this.assignmentApi.getAssignmentById(this.courseId, this.assignmentId);
	group$!: Observable<GroupDto | null>;

	constructor(
		private readonly store: Store,
		private readonly route: ActivatedRoute,
		private readonly userApi: UserApi,
		private readonly assignmentApi: AssignmentApi
	) {}

	async ngOnInit(): Promise<void> {
		this.userId = (await firstValueFrom(this.user$))!.id!;
		this.group$ = this.userApi.getGroupOfAssignment(
			this.userId,
			this.courseId,
			this.assignmentId
		);
	}
}
