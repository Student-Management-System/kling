import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { IconModule } from "@web-ide/client/shared/components";
import { ExerciseSubmitterService } from "../exercise-submitter.service";
import { CheckMessageModule } from "./check-message/check-message.component";

@Component({
	selector: "web-ide-submission-result",
	templateUrl: "./submission-result.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubmissionResultComponent {
	submissionResult$ = this.exerciseSubmitter.submissionResult$;

	constructor(private readonly exerciseSubmitter: ExerciseSubmitterService) {}
}

@NgModule({
	declarations: [SubmissionResultComponent],
	exports: [SubmissionResultComponent],
	imports: [CommonModule, TranslateModule, CheckMessageModule, IconModule]
})
export class SubmissionResultModule {}
