import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CodeExecutionService } from "../../../services/code-execution.service";

@Component({
	selector: "app-run-code",
	templateUrl: "./run-code.component.html",
	styleUrls: ["./run-code.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RunCodeComponent {
	disabled$ = this.codeExecutionService.isRunning$;

	constructor(private readonly codeExecutionService: CodeExecutionService) {}

	run(): void {
		this.codeExecutionService.triggerExecution();
	}
}
