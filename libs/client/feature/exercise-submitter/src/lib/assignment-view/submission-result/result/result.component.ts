import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { SubmissionResultDto } from "@student-mgmt/exercise-submitter-api-client";
import { IconModule } from "@web-ide/client/shared/components";
import { CheckMessageModule } from "../check-message/check-message.component";

@Component({
	selector: "web-ide-result",
	templateUrl: "./result.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultComponent {
	@Input() result!: SubmissionResultDto;
}

@NgModule({
	declarations: [ResultComponent],
	exports: [ResultComponent],
	imports: [CommonModule, CheckMessageModule, IconModule, TranslateModule]
})
export class ResultComponentModule {}
