import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CodeExecutionService } from "../../services/code-execution.service";

type StdStreams = { stdout: string; stderr: string };

@Injectable()
export class TerminalService {
	private output$ = new BehaviorSubject<StdStreams>(null);
	readonly _output$ = this.output$.asObservable();

	readonly displayLoadingIndicator$ = this.codeExecution.isRunning$;

	constructor(private readonly codeExecution: CodeExecutionService) {
		this.codeExecution.executeResult$.subscribe(result => {
			if (result) {
				const { compile, run } = result;

				if (run?.stdout?.length > 0 || run?.stderr?.length > 0) {
					this.setOutput(run);
				} else if (compile?.stdout?.length > 0 || compile?.stderr?.length > 0) {
					this.setOutput(compile);
				}
			} else {
				this.setOutput(null);
			}
		});
	}

	setOutput(output: StdStreams): void {
		this.output$.next(output);
	}
}
