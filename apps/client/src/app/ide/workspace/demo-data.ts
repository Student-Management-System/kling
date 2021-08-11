import { Store } from "@ngrx/store";
import {
	createDirectory,
	createFile,
	FileActions,
	WorkspaceActions
} from "@kling/client/data-access/state";

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
		System.out.println("Hello World");

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

export function createPlaygroundFiles(store: Store): void {
	store.dispatch(WorkspaceActions.setProjectName({ name: "Playground" }));
	// this.store
	// 	.select(WorkspaceSelectors.selectWorkspaceState)
	// 	.pipe(take(1))
	// 	.subscribe(state => {
	// 		const initialFile = createFile("main.ts", state.language, "", "// main.ts");
	// 		const project = {
	// 			files: [initialFile],
	// 			directories: [],
	// 			projectName: "Playground",
	// 			language: state.language ?? "java",
	// 			theme: state.theme
	// 		};
	// 		this.store.dispatch(WorkspaceActions.loadProject(project));
	// 		this.store.dispatch(FileActions.setSelectedFile({ file: initialFile }));
	// 	});
}

export function createDemoFiles(store: Store): void {
	const lang = this.route.snapshot.queryParams.lang;
	let data = this.route.snapshot.queryParams.data;

	if (data) {
		data = JSON.parse(atob(data));
		console.log(data);
	}

	if (!lang || lang === "typescript") {
		const directories = [
			createDirectory(""),
			createDirectory("robots", ""),
			createDirectory("animals", ""),
			createDirectory("birds", "animals")
		];

		const files = [
			createFile("running-sum.ts", "typescript", "", exampleRunningSum),
			createFile("person.ts", "typescript", "", example),
			createFile("abstract-animal.ts", "typescript", "animals", "// abstract-animal.ts"),
			createFile("dog.ts", "typescript", "animals", "// dog.ts"),
			createFile("cat.ts", "typescript", "animals", "// cat.ts"),
			createFile("robot.ts", "typescript", "robots", "// robot.ts"),
			createFile("bird.ts", "typescript", "animals/birds", "// bird.ts")
		];

		const project = {
			directories,
			files,
			projectName: "Example project",
			language: "typescript",
			theme: "dark"
		};

		store.dispatch(WorkspaceActions.loadProject(project));
		store.dispatch(FileActions.setSelectedFile({ file: files[0] }));
	}

	if (lang == "java") {
		const files = [
			createFile("Main.java", "java", "", javaExample),
			createFile("Solution.java", "java", "", javaCountToNumber)
		];

		const project = {
			directories: [createDirectory("")],
			files: files,
			projectName: "Example project",
			language: "java",
			theme: "dark"
		};

		store.dispatch(WorkspaceActions.loadProject(project));
		store.dispatch(FileActions.setSelectedFile({ file: project.files[0] }));
	}
}
