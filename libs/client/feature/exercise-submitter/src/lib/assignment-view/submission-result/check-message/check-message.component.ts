import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { CheckMessageDto } from "@student-mgmt/exercise-submitter-api-client";

@Component({
	selector: "web-ide-check-message",
	templateUrl: "./check-message.component.html",
	styleUrls: ["./check-message.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckMessageComponent {
	@Input() message!: CheckMessageDto;

	typeEnum = CheckMessageDto.TypeEnum;
}

@NgModule({
	declarations: [CheckMessageComponent],
	exports: [CheckMessageComponent],
	imports: [CommonModule]
})
export class CheckMessageModule {}
