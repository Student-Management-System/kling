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
import { AssignmentDto } from "@student-mgmt/api-client";
import { AssignmentComponent } from "../assignment/assignment.component";
import { SubmissionResultModule } from "../submission-result/submission-result.component";

@Component({
	selector: "web-ide-assignment-list",
	templateUrl: "./assignment-list.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentListComponent {
	@Input() courseId!: string;
	@Input() assignments!: AssignmentDto[];
	@Output() selected = new EventEmitter<AssignmentDto>();

	typeEnum = AssignmentDto.TypeEnum;
	collaborationEnum = AssignmentDto.CollaborationEnum;
	stateEnum = AssignmentDto.StateEnum;
}

@NgModule({
	declarations: [AssignmentListComponent, AssignmentComponent],
	exports: [AssignmentListComponent],
	imports: [CommonModule, TranslateModule, MatProgressSpinnerModule, SubmissionResultModule]
})
export class AssignmentListModule {}
