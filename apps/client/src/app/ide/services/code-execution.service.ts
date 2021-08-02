import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, InjectionToken } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";

export type ExecuteRequest = {
	/** The language to use for execution, must be a string and must be installed. */
	language: string;
	/** The version of the language to use for execution, must be a string containing a SemVer selector for the version or the specific version number to use. */
	version: string;
	/** An array of files containing code or other data that should be used for execution. The first file in this array is considered the main file. */
	files: {
		name: string;
		content: string;
	}[];
	/** The text to pass as stdin to the program. Must be a string or left out. Defaults to blank string. */
	stdin?: string;
	/** The arguments to pass to the program. Must be an array or left out. Defaults to []. */
	args?: string[];
	/** The maximum time allowed for the compile stage to finish before bailing out in milliseconds. Must be a number or left out. Defaults to 10000 (10 seconds). */
	compile_timeout?: number;
	/** The maximum time allowed for the run stage to finish before bailing out in milliseconds. Must be a number or left out. Defaults to 3000 (3 seconds). */
	run_timeout?: number;
	/** The maximum amount of memory the compile stage is allowed to use in bytes. Must be a number or left out. Defaults to -1 (no limit). */
	compile_memory_limit?: number;
	/** The maximum amount of memory the run stage is allowed to use in bytes. Must be a number or left out. Defaults to -1 (no limit). */
	run_memory_limit?: number;
};

type Output = {
	stdout: string;
	stderr: string;
	output: string;
	code: string;
	signal: string;
};

type ExecuteResponse = {
	/** Name (not alias) of the runtime used. */
	language: string;
	/** Version of the used runtime. */
	version: string;
	/** Results from the run stage. */
	run: Output;
	/** Results from the compile stage, only provided if the runtime has a compile stage */
	compile?: Output;
};

type RuntimesResponse = {
	language: string;
	version: string;
	aliases: string[];
	runtime?: string;
}[];

export const PISTON_API_URL = new InjectionToken<string>("URL of the piston code execution api.");

@Injectable()
export class CodeExecutionService {
	readonly executeResult$ = new BehaviorSubject<ExecuteResponse>(null);

	private executeUrl: string;
	private runtimesUrl: string;

	constructor(
		private readonly http: HttpClient,
		@Inject(PISTON_API_URL) private readonly url: string
	) {
		if (!(url?.length > 0)) {
			console.error("Piston Code Execution: No URL specified in environment.");
		}

		this.executeUrl = `${this.url}/api/v2/execute`;
		this.runtimesUrl = `${this.url}/api/v2/runtimes`;
	}

	/** Runs the given code, using the given runtime and arguments, returning the result. */
	execute(request: ExecuteRequest): Observable<ExecuteResponse> {
		return this.http
			.post<ExecuteResponse>(this.executeUrl, request)
			.pipe(tap(result => this.executeResult$.next(result)));
	}

	/** Returns a list of available languages, including the version, runtime and aliases. */
	getRuntimes(): Observable<RuntimesResponse> {
		return this.http.get<RuntimesResponse>(this.runtimesUrl, {});
	}
}
