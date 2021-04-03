import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import {
	createDirectory,
	createFile,
	File,
	FileActions,
	FileSelectors,
	WorkspaceActions
} from "@kling/client/data-access/state";
import { Store } from "@ngrx/store";
import { from } from "rxjs";
import { take } from "rxjs/operators";
import { UnsubscribeOnDestroy } from "../../shared/components/unsubscribe-on-destroy.component";
import { SidenavService } from "../../shared/services/sidenav.service";
import { WebSocketService } from "../../shared/services/web-socket.service";
import { CodeEditorComponent } from "../editor/components/code-editor/code-editor.component";
import { TerminalFacade } from "../feature-panel/services/terminal.facade";
import { WorkspaceLayout, WorkspaceSettingsService } from "../services/workspace-settings.service";
import { WorkspaceFacade } from "../services/workspace.facade";

class Solution {
	constructor(
		public readonly files: File[],
		public readonly language: string,
		public readonly options?: unknown
	) {}
}

const exampleRunningSum = `export function calculateRunningSum(nums: number[]) {
	console.log("Input: " +  nums);

	const result = [];
	let current = 0;
	for (let i = 1; i < nums.length; i++) {

		console.log("Current: " + current + ", Adding: " + nums[i]);
		current += nums[i];
		result.push(current);

	}

	console.log("Result: " + result);
	return result;
}
export function calculateRunningSum(nums: number[]) {
	console.log("Input: " +  nums);

	const result = [];
	let current = 0;
	for (let i = 1; i < nums.length; i++) {

		console.log("Current: " + current + ", Adding: " + nums[i]);
		current += nums[i];
		result.push(current);

	}

	console.log("Result: " + result);
	return result;
}
export function calculateRunningSum(nums: number[]) {
	console.log("Input: " +  nums);

	const result = [];
	let current = 0;
	for (let i = 1; i < nums.length; i++) {

		console.log("Current: " + current + ", Adding: " + nums[i]);
		current += nums[i];
		result.push(current);

	}

	console.log("Result: " + result);
	return result;
}
export function calculateRunningSum(nums: number[]) {
	console.log("Input: " +  nums);

	const result = [];
	let current = 0;
	for (let i = 1; i < nums.length; i++) {

		console.log("Current: " + current + ", Adding: " + nums[i]);
		current += nums[i];
		result.push(current);

	}

	console.log("Result: " + result);
	return result;
}
export function calculateRunningSum(nums: number[]) {
	console.log("Input: " +  nums);

	const result = [];
	let current = 0;
	for (let i = 1; i < nums.length; i++) {

		console.log("Current: " + current + ", Adding: " + nums[i]);
		current += nums[i];
		result.push(current);

	}

	console.log("Result: " + result);
	return result;
}
`;

const example = `export class Person {

	constructor(private firstname: string, private lastname: string) { }

	getFullname(): string {
		return \`\${this.firstname} \${this.lastname}\`;
	}
	getFirstname(): string {
		return this.firstname;
	}

}`;

const exampleWithImport = `
// Test.ts
import { Person } from "../person";

const person = new Person("Lukas", "K");
console.log(person);
`;

const javaExample = `// Java Example
public class Main { 
	public static void main(String[] args) {
		System.out.println("Hello World from Java");

		for (int i = 0; i < 10; i++) {
			System.out.println(i);
		}
	}
}
`;

const javaCountToNumber = `public class Solution {

    /**
    * Print each number from "start" to "end" (inclusive) on a seperate line.
    */
    public void countToNumber(int start, int end) {
        for (int i = start; i <= end, i++) {
            System.out.println(i);
        }
    }

}`;

type PistonResponse = {
	ran: boolean;
	language: string;
	version: string;
	output: string;
	stdout: string;
	stderr: string;
};

@Component({
	selector: "app-workspace",
	templateUrl: "./workspace.component.html",
	styleUrls: ["./workspace.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceComponent extends UnsubscribeOnDestroy implements OnInit, OnDestroy {
	@ViewChild("editor", { static: true }) private codeEditor: CodeEditorComponent;
	selectedSideBarTab: string;
	layout: WorkspaceLayout;

	constructor(
		public workspaceSettings: WorkspaceSettingsService,
		private sidenav: SidenavService,
		private workspace: WorkspaceFacade,
		private terminal: TerminalFacade,
		private websocket: WebSocketService,
		private http: HttpClient,
		private readonly store: Store
	) {
		super();
	}

	ngOnInit(): void {
		this.sidenav.forceOverlayMode(true);
		this.store.dispatch(WorkspaceActions.initEmptyProject());

		this.subs.sink = this.workspaceSettings.layout$.subscribe(layout => {
			this.layout = layout;
			setTimeout(() => this.codeEditor.resize(), 0); // Hack: Delay resize to prevent race condition
		});
	}

	handleEditorInit(): void {
		// const directories = [
		// 	createDirectory("root"),
		// 	createDirectory("robots", "root"),
		// 	createDirectory("animals", "root"),
		// 	createDirectory("birds", "root/animals")
		// ];

		// const files = [
		// 	createFile("running-sum.ts", "root", exampleRunningSum),
		// 	createFile("helper-methods.ts", "root", example),
		// 	createFile("abstract-animal.ts", "root/animals", "// abstract-animal.ts"),
		// 	createFile("dog.ts", "root/animals", "// dog.ts"),
		// 	createFile("cat.ts", "root/animals", "// cat.ts"),
		// 	createFile("robot.ts", "root/robots", "// robot.ts"),
		// 	createFile("bird.ts", "root/animals/birds", "// bird.ts")
		// ];

		const file = createFile("Main.java", "java", "root", javaExample);
		const file2 = createFile("Solution.java", "java", "root", javaCountToNumber);

		const project = {
			directories: [createDirectory("root")],
			files: [file, file2],
			projectName: "Example project",
			language: "java",
			theme: "dark"
		};

		this.store.dispatch(WorkspaceActions.loadProject(project));
		this.store.dispatch(FileActions.setSelectedFile({ fileId: "root/Main.java" }));
	}

	onDragEnd(event: any): void {
		// event: { gutterNum: number; sizes: number[] }
		this.workspaceSettings.setLayout("custom", {
			explorerWidth: event.sizes[0],
			editorWidth: event.sizes[1],
			featurePanelWidth: event.sizes[2]
		});
	}

	run(): void {
		this.store
			.select(FileSelectors.selectAllFiles)
			.pipe(take(1))
			.subscribe(files => {
				const submission = this.createSubmission(files);

				this.terminal.clear();

				this.http
					.post("https://emkc.org/api/v1/piston/execute", {
						language: "java",
						source: submission.solution.files[0].content
					})
					.subscribe({
						next: (result: PistonResponse) => {
							console.log(result);
							result.output.split("\n").forEach(line => {
								this.terminal.write(line);
							});
						},
						error: error => {
							console.log(error);
						}
					});

				// this.terminal.write("Connecting to server...");
				// this.websocket.connect("/run-code");
				// this.websocket.emit("RUN_CODE", submission);
				// this.subs.sink = this.websocket.listenTo("RUN_CODE_RESULT").subscribe({
				// 	next: result => {
				// 		console.log("RUN_CODE_RESULT:", result);
				// 		this.terminal.write(result as string);
				// 	},
				// 	complete: () => {
				// 		this.terminal.write("Completed. Disconnecting.");
				// 		this.websocket.disconnect();
				// 	},
				// 	error: error => {
				// 		console.log("Error", error);
				// 		this.terminal.write(JSON.stringify(error));
				// 		this.websocket.disconnect();
				// 	}
				// });

				// this.subs.sink = this.websocket.listenTo("disconnect").subscribe({
				// 	next: result => {
				// 		this.terminal.write("Disconnected.");
				// 	},
				// 	error: error => {
				// 		this.terminal.write("Disconnected (from error).");
				// 	}
				// });
			});
	}

	runTests(): void {
		this.store
			.select(FileSelectors.selectAllFiles)
			.pipe(take(1))
			.subscribe(files => {
				this.terminal.clear();
				const submission = this.createSubmission(files);

				this.websocket.connect("/run-code");
				this.websocket.emit("RUN_TESTS", submission);
				this.subs.sink = this.websocket.listenTo("RUN_TESTS_RESPONSE").subscribe({
					next: result => {
						console.log("RUN_TESTS_RESPONSE:", result);
						(result as string).split("\n").forEach(line => {
							this.terminal.write(line.trim());
						});
					},
					complete: () => {
						this.terminal.write("Completed. Disconnecting.");
						this.websocket.disconnect();
					},
					error: error => {
						console.log("Error", error);
						this.terminal.write(JSON.stringify(error));
						this.websocket.disconnect();
					}
				});

				this.subs.sink = this.websocket
					.listenTo("disconnect")
					.pipe(take(1))
					.subscribe({
						next: result => {
							this.terminal.write("Disconnected.");
						},
						error: error => {
							this.terminal.write("Disconnected (from error).");
						}
					});
			});
	}

	private createSubmission(files: File[]) {
		const filesWithContent = files.map(file => ({
			...file,
			content: this.codeEditor.getFileContent(file.path)
		}));

		const solution = new Solution(filesWithContent, "typescript");

		const submission = {
			solution,
			language: "typescript",
			problemId: "example"
		};
		return submission;
	}

	ngOnDestroy(): void {
		super.ngOnDestroy();
		this.sidenav.forceOverlayMode(false);
	}
}
