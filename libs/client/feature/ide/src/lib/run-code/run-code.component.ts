import { ChangeDetectionStrategy, Component } from "@angular/core";
import { StudentMgmtSelectors } from "@web-ide/client/data-access/state";
import { CodeExecutionService, WorkspaceService } from "@web-ide/ide-services";
import { Store } from "@ngrx/store";
import { combineLatest, map } from "rxjs";

@Component({
	selector: "web-ide-run-code",
	templateUrl: "./run-code.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RunCodeComponent {
	disabled$ = combineLatest([
		this.codeExecutionService.isRunning$,
		this.store.select(StudentMgmtSelectors.user)
	]).pipe(map(([isRunning, isLoggedIn]) => isRunning || !isLoggedIn));

	entryPoint$ = this.workspace.entryPoint$;

	constructor(
		private workspace: WorkspaceService,
		private readonly codeExecutionService: CodeExecutionService,
		private readonly store: Store
	) {}

	run(): void {
		this.codeExecutionService.triggerExecution();
	}
}
