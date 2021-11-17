import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	NgModule,
	Output
} from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { AssignmentDto } from "@student-mgmt/api-client";

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
	declarations: [AssignmentListComponent],
	exports: [AssignmentListComponent],
	imports: [CommonModule, TranslateModule]
})
export class AssignmentListModule {}
