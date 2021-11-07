import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { AssignmentDto } from "@student-mgmt/api-client";

@Component({
	selector: "kling-assignment-list",
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
