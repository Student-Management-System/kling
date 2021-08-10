import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { CodeExecutionService } from "../../services/code-execution.service";

@Injectable()
export class TerminalFacade {
	private _write$ = new Subject<string>();
	write$ = this._write$.asObservable();

	private _clear$ = new Subject<void>();
	clear$ = this._clear$.asObservable();

	constructor(private readonly codeExecution: CodeExecutionService) {
		codeExecution.executeResult$.subscribe(result => {
			this.clear();

			if (result?.compile) {
				this.writeCodeExecutionResult(result.compile);
			}

			if (result?.run) {
				this.writeCodeExecutionResult(result.run);
			}
		});
	}

	private writeCodeExecutionResult({ stdout, stderr }: { stdout: string; stderr: string }): void {
		if (stderr?.length >= 1) {
			this.write(stderr);
		} else if (stdout?.length >= 1) {
			this.write(stdout);
		} else {
			this.write("(no output)");
		}
	}

	write(text: string): void {
		const lines = text.split("\n");
		lines.forEach(line => this._write$.next(line));
	}

	clear(): void {
		this._clear$.next();
	}
}
