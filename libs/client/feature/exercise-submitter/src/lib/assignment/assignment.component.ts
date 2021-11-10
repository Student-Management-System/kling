import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { AssignmentDto, GroupDto, UserDto } from "@student-mgmt/api-client";
import { SubmissionResultDto } from "@student-mgmt/exercise-submitter-api-client";
import { ExerciseSubmitterService } from "../exercise-submitter.service";
import { SubmitInfo } from "../exercise-submitter/exercise-submitter.component";

@Component({
	selector: "web-ide-assignment",
	templateUrl: "./assignment.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentComponent {
	@Input() courseId!: string;
	@Input() assignment!: AssignmentDto;
	@Input() user!: UserDto;
	@Input() group?: GroupDto | null;
	@Input() result?: SubmissionResultDto;
	@Output() submitSolution = new EventEmitter<SubmitInfo>();

	isSubmitting$ = this.exerciseSubmitter.isSubmitting$;

	constructor(private readonly exerciseSubmitter: ExerciseSubmitterService) {}

	submit(): void {
		this.submitSolution.next({
			courseId: this.courseId,
			assignmentName: this.assignment.name,
			groupOrUsername: this.group?.name ?? this.user.username
		});
	}
}
