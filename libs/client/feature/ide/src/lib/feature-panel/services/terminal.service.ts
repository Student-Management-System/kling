import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CodeExecutionService, ExecuteResponse } from "@web-ide/ide-services";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs";

type StdStreams = { stdout: string; stderr: string };

@Injectable()
export class TerminalService {
	private output$ = new BehaviorSubject<StdStreams>(null);
	readonly _output$ = this.output$.asObservable();

	readonly displayLoadingIndicator$ = this.codeExecution.isRunning$;

	constructor(
		private readonly codeExecution: CodeExecutionService,
		private readonly translate: TranslateService
	) {
		this.codeExecution.executeResult$.subscribe(result => {
			if (result instanceof HttpErrorResponse) {
				this.setHttpErrorResponseOutput(result);
			} else if (result) {
				this.setExecutionResultOutput(result);
			} else {
				this.setOutput(null);
			}
		});
	}

	private setExecutionResultOutput(result: ExecuteResponse) {
		const { compile, run } = result;

		if (run?.stdout?.length > 0 || run?.stderr?.length > 0) {
			this.setOutput(run);
		} else if (compile?.stdout?.length > 0 || compile?.stderr?.length > 0) {
			this.setOutput(compile);
		} else {
			this.setOutput({ stdout: "(No output)", stderr: null });
		}
	}

	private setHttpErrorResponseOutput(error: HttpErrorResponse) {
		const { name, url, status, statusText, message } = error;

		const jsonError = JSON.stringify(
			{
				name,
				url,
				status,
				statusText,
				message
			},
			null,
			4
		);

		this.output$.next({
			stdout: null,
			stderr: this.translate.instant("Error.Piston") + "\n" + jsonError
		});
	}

	setOutput(output: StdStreams): void {
		this.output$.next(output);
	}
}
