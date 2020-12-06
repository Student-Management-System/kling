import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { take } from "rxjs/operators";
import { FileActions, FileSelectors, WorkspaceActions } from "../../root-store";
import { createDirectory } from "../../root-store/directory-store/directory.model";
import { createFile, File } from "../../root-store/file-store/file.model";
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
		const directories = [
			createDirectory("root"),
			createDirectory("robots", "root"),
			createDirectory("animals", "root"),
			createDirectory("birds", "root/animals")
		];

		const files = [
			createFile("running-sum.ts", "root", exampleRunningSum),
			createFile("helper-methods.ts", "root", example),
			createFile("abstract-animal.ts", "root/animals", "// abstract-animal.ts"),
			createFile("dog.ts", "root/animals", "// dog.ts"),
			createFile("cat.ts", "root/animals", "// cat.ts"),
			createFile("robot.ts", "root/robots", "// robot.ts"),
			createFile("bird.ts", "root/animals/birds", "// bird.ts")
		];

		const project = {
			directories,
			files,
			projectName: "Example project",
			language: "typescript",
			theme: "dark"
		};

		this.store.dispatch(WorkspaceActions.loadProject(project));
		this.store.dispatch(FileActions.setSelectedFile({ fileId: "root/running-sum.ts" }));
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
				const filesWithContent = files.map(file =>
					createFile(
						file.name,
						file.directoryPath,
						this.codeEditor.getFileContent(file.path)
					)
				);
				const solution = new Solution(filesWithContent, "typescript");

				const submission = {
					solution,
					language: "typescript",
					problemId: "example"
				};

				this.terminal.clear();
				this.terminal.write("Connecting to server...");
				this.websocket.connect("/run-code");
				this.websocket.emit("RUN_CODE", submission);
				this.subs.sink = this.websocket.listenTo("RUN_CODE_RESULT").subscribe({
					next: result => {
						console.log("RUN_CODE_RESULT:", result);
						this.terminal.write(result as string);
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

				this.subs.sink = this.websocket.listenTo("disconnect").subscribe({
					next: result => {
						this.terminal.write("Disconnected.");
					},
					error: error => {
						this.terminal.write("Disconnected (from error).");
					}
				});
			});
	}

	ngOnDestroy(): void {
		super.ngOnDestroy();
		this.sidenav.forceOverlayMode(false);
	}
}
