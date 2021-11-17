import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { ExerciseSubmitterService } from "../../exercise-submitter.service";
import { ResultComponentModule } from "./result/result.component";

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
	imports: [CommonModule, ResultComponentModule]
})
export class SubmissionResultModule {}
