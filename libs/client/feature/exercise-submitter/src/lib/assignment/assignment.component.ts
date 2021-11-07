import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { AssignmentDto, GroupDto, UserDto } from "@student-mgmt/api-client";

@Component({
	selector: "kling-assignment",
	templateUrl: "./assignment.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentComponent {
	@Input() courseId!: string;
	@Input() assignment!: AssignmentDto;
	@Input() user!: UserDto;
	@Input() group!: GroupDto | null;
}
