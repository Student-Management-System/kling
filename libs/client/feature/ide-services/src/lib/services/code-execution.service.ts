import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, InjectionToken } from "@angular/core";
import { getLanguageFromFilename } from "@kling/programming";
import { BehaviorSubject, firstValueFrom, Subject } from "rxjs";

export type PistonFile = {
	name: string;
	content: string;
};

type ExecuteRequest = {
	/** The language to use for execution, must be a string and must be installed. */
	language: string;
	/** The version of the language to use for execution, must be a string containing a SemVer selector for the version or the specific version number to use. */
	version: string;
	/** An array of files containing code or other data that should be used for execution. The first file in this array is considered the main file. */
	files: PistonFile[];
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

export type IncompleteExecuteRequest = Pick<ExecuteRequest, "files" | "stdin" | "args">;

export type ExecuteResponse = {
	/** Name (not alias) of the runtime used. */
	language: string;
	/** Version of the used runtime. */
	version: string;
	/** Results from the run stage. */
	run: Output;
	/** Results from the compile stage, only provided if the runtime has a compile stage */
	compile?: Output;
};

type Output = {
	stdout: string;
	stderr: string;
	output: string;
	code: string;
	signal: string;
};

type Runtime = {
	language: string;
	version: string;
	aliases: string[];
	runtime?: string;
};

export const PISTON_API_URL = new InjectionToken<string>("URL of the piston code execution api.");

@Injectable({ providedIn: "root" })
export class CodeExecutionService {
	readonly executeResult$ = new BehaviorSubject<ExecuteResponse | null>(null);

	/** Map of installed programming languages mapped to their version. */
	runtimes: { [language: string]: string } = {};

	private _onTriggerExecution$ = new Subject<void>();

	/**
	 * Emits when {@link triggerExecution} is called.
	 *
	 * There should be subscribed to by a single component or service that can build the necessary
	 * objects to call this service's {@link execute} method.
	 */
	readonly onTriggerExecution$ = this._onTriggerExecution$.asObservable();

	isRunning$ = new BehaviorSubject(false);

	private executeUrl: string;
	private runtimesUrl: string;

	constructor(
		private readonly http: HttpClient,
		@Inject(PISTON_API_URL) private readonly pistonApiUrl: string
	) {
		this.executeUrl = `${this.pistonApiUrl}/api/v2/execute`;
		this.runtimesUrl = `${this.pistonApiUrl}/api/v2/runtimes`;
	}

	/**
	 * Informs responsible listeners via the {@link onTriggerExecution$} observable to call the
	 * {@link execute} method.
	 *
	 * Should be called from components that cannot access the necessary data to build the
	 * {@link ExecuteRequest} themselves.
	 */
	triggerExecution(): void {
		this._onTriggerExecution$.next();
	}

	/**
	 * Executes the given files. The first file will be used as entry point.
	 * The result will be published via {@link executeResult$}.
	 */
	async execute(incompleteRequest: IncompleteExecuteRequest): Promise<void> {
		const request = await this._createExecuteRequestObject(incompleteRequest);

		this.isRunning$.next(true);
		this.executeResult$.next(null);

		try {
			const result = await firstValueFrom(
				this.http.post<ExecuteResponse>(this.executeUrl, request)
			);
			this.isRunning$.next(false);
			this.executeResult$.next(result);
		} catch (error) {
			console.error(error);
			this.isRunning$.next(false);
		}
	}

	async _createExecuteRequestObject(
		incompleteRequest: IncompleteExecuteRequest
	): Promise<ExecuteRequest> {
		const entryPoint = incompleteRequest.files[0];

		if (!entryPoint) {
			throw new Error("There are no files to execute.");
		}

		const language = getLanguageFromFilename(entryPoint.name);

		if (!language) {
			throw new Error(`Could not determine language of file: ${entryPoint.name}`);
		}

		const version = await this._getVersionOfLanguage(language);

		const request: ExecuteRequest = {
			files: incompleteRequest.files,
			stdin: incompleteRequest.stdin,
			args: incompleteRequest.args,
			language,
			version
		};

		console.log(
			`Running ${language} (${version}) code with "${entryPoint.name}" as entry point.`
		);

		return request;
	}

	/**
	 * Returns the version for the corresponding programming `language`.
	 * If this information is not cached locally, it will be retrieved from the Piston API.
	 * Throws an error, if `language` is not installed.
	 *
	 * @param language Programming language of the file that should be executed.
	 */
	async _getVersionOfLanguage(language: string): Promise<string> {
		if (!this.runtimes[language]) {
			const installedRuntimes = await firstValueFrom(
				this.http.get<Runtime[]>(this.runtimesUrl)
			);

			installedRuntimes.forEach(runtime => {
				this.runtimes[runtime.language] = runtime.version;
			});

			if (!this.runtimes[language]) {
				throw new Error(`Language is not installed: ${language}`);
			}
		}

		return this.runtimes[language];
	}
}
