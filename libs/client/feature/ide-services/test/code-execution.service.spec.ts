import { HttpClient } from "@angular/common/http";
import { CollaborationService } from "@web-ide/collaboration";
import { of } from "rxjs";
import { CodeExecutionService } from "../src/lib/services/code-execution.service";

const mock_HttpClient = (): Partial<HttpClient> => ({
	post: jest.fn(),
	get: jest.fn().mockReturnValue(
		of([
			{
				language: "typescript",
				version: "4.2.3",
				aliases: ["ts", "node-ts", "tsc"]
			},
			{
				language: "java",
				version: "15.0.2",
				aliases: []
			},
			{
				language: "python",
				version: "3.10.0",
				aliases: ["py", "py3", "python3", "python3.10"]
			},
			{
				language: "javascript",
				version: "16.3.0",
				aliases: ["node-javascript", "node-js", "javascript", "js"],
				runtime: "node"
			}
		])
	)
});

const mock_CollaborationService = () => ({});

describe("CodeExecutionService", () => {
	let service: CodeExecutionService;
	let httpClient: HttpClient;
	let collaboration: CollaborationService;
	const pistonApiUrl = "abc://piston.api";

	beforeEach(() => {
		httpClient = mock_HttpClient() as HttpClient;
		collaboration = mock_CollaborationService() as CollaborationService;
		service = new CodeExecutionService(httpClient, collaboration, pistonApiUrl);
	});

	it("Should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("_getVersionOfLanguage", () => {
		it("Language not installed -> Throws Error", async () => {
			expect(service._getVersionOfLanguage("not_installed")).rejects.toThrow(
				"Language is not installed: not_installed"
			);
		});

		it("Language not cached -> Loads runtimes from API", async () => {
			const version = await service._getVersionOfLanguage("java");
			expect(httpClient.get).toHaveBeenCalledWith(expect.stringMatching("/runtimes"));
			expect(version).toEqual("15.0.2");
		});

		it("Language cached -> Looks up version in cache", async () => {
			const javaVersion = "1.2.3";

			service.runtimes = {
				typescript: "4.4",
				java: javaVersion
			};

			const version = await service._getVersionOfLanguage("java");

			expect(httpClient.get).toHaveBeenCalledTimes(0);
			expect(version).toEqual(javaVersion);
		});
	});

	describe("_createExecuteRequestObject", () => {
		it("No files -> Throws Error", () => {
			expect(
				service._createExecuteRequestObject({
					files: []
				})
			).rejects.toThrow("There are no files to execute.");
		});

		it("Entry file has unknown file extension -> Throws Error", () => {
			expect(
				service._createExecuteRequestObject({
					files: [
						{
							name: "abc.unknown",
							content: "File with unknown extension"
						}
					]
				})
			).rejects.toThrow("Could not determine language of file: abc.unknown");
		});

		it("Creates ExecuteRequest", async () => {
			const files = [
				{
					name: "main.ts",
					content: "// main.ts"
				},
				{
					name: "input/text.txt",
					content: "some text"
				}
			];

			const stdin = "Hello world";

			const args = ["arg1", "arg2"];

			const request = await service._createExecuteRequestObject({ files, stdin, args });

			expect(request.files.length).toEqual(files.length);
			expect(request.stdin).toEqual(stdin);
			expect(request.args).toEqual(args);
			expect(request.language).toEqual("typescript");
			expect(request.version).toEqual("4.2.3");
		});
	});
});
