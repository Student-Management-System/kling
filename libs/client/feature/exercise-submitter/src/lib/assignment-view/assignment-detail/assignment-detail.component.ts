import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { AssignmentDto, GroupDto } from "@student-mgmt/api-client";

@Component({
	selector: "web-ide-assignment-detail",
	templateUrl: "./assignment-detail.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentDetailComponent {
	@Input() assignment!: AssignmentDto;
	@Input() group?: GroupDto | null;
}

@NgModule({
	declarations: [AssignmentDetailComponent],
	exports: [AssignmentDetailComponent],
	imports: [CommonModule, TranslateModule]
})
export class AssignmentDetailComponentModule {}
