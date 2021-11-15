import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { AssignmentDto, GroupDto } from "@student-mgmt/api-client";
import { IconModule, PersonIconComponentModule } from "@web-ide/client/shared/components";

@Component({
	selector: "web-ide-assignment-detail",
	templateUrl: "./assignment-detail.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentDetailComponent {
	@Input() assignment!: AssignmentDto;
	@Input() group?: GroupDto | null;

	assignmentState = AssignmentDto.StateEnum;
}

@NgModule({
	declarations: [AssignmentDetailComponent],
	exports: [AssignmentDetailComponent],
	imports: [CommonModule, TranslateModule, IconModule, PersonIconComponentModule]
})
export class AssignmentDetailComponentModule {}
