import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CodeExecutionService, WorkspaceService } from "@kling/ide-services";

@Component({
	selector: "kling-run-code",
	templateUrl: "./run-code.component.html",
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
