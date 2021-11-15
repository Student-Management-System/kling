import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { CheckMessageDto } from "@student-mgmt/exercise-submitter-api-client";
import { IconModule } from "@web-ide/client/shared/components";

@Component({
	selector: "web-ide-check-message",
	templateUrl: "./check-message.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckMessageComponent {
	@Input() message!: CheckMessageDto;

	typeEnum = CheckMessageDto.TypeEnum;
}

@NgModule({
	declarations: [CheckMessageComponent],
	exports: [CheckMessageComponent],
	imports: [CommonModule, IconModule, TranslateModule]
})
export class CheckMessageModule {}
