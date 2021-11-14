import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	NgModule,
	Output
} from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TranslateModule } from "@ngx-translate/core";
import { AssignmentDto, GroupDto, UserDto } from "@student-mgmt/api-client";
import { SubmissionResultDto } from "@student-mgmt/exercise-submitter-api-client";
import { SubmitInfo } from "../exercise-submitter.component";
import { ExerciseSubmitterService } from "../exercise-submitter.service";
import { AssignmentDetailComponentModule } from "./assignment-detail/assignment-detail.component";
import { SubmissionResultModule } from "./submission-result/submission-result.component";

@Component({
	selector: "web-ide-assignment-view",
	templateUrl: "./assignment-view.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentViewComponent {
	@Input() courseId!: string;
	@Input() assignment!: AssignmentDto;
	@Input() user!: UserDto;
	@Input() group?: GroupDto | null;
	@Input() result?: SubmissionResultDto;
	@Output() submitSolution = new EventEmitter<SubmitInfo>();

	isSubmitting$ = this.exerciseSubmitter.isSubmitting$;

	assignmentState = AssignmentDto.StateEnum;

	constructor(private readonly exerciseSubmitter: ExerciseSubmitterService) {}

	submit(): void {
		this.submitSolution.next({
			courseId: this.courseId,
			assignmentName: this.assignment.name,
			groupOrUsername: this.group?.name ?? this.user.username
		});
	}
}

@NgModule({
	declarations: [AssignmentViewComponent],
	exports: [AssignmentViewComponent],
	imports: [
		CommonModule,
		TranslateModule,
		MatProgressSpinnerModule,
		AssignmentDetailComponentModule,
		SubmissionResultModule
	]
})
export class AssignmentViewComponentModule {}
