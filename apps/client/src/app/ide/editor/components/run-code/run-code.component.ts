import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CodeExecutionService } from "../../../services/code-execution.service";
import { WorkspaceService } from "../../../services/workspace.service";

@Component({
	selector: "app-run-code",
	templateUrl: "./run-code.component.html",
	styleUrls: ["./run-code.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RunCodeComponent {
	disabled$ = this.codeExecutionService.isRunning$;
	entryPoint$ = this.workspace.entryPoint$;

	constructor(
		private workspace: WorkspaceService,
		private readonly codeExecutionService: CodeExecutionService
	) {}

	run(): void {
		this.codeExecutionService.triggerExecution();
	}
}
