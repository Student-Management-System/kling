import { File, createFile } from "@kling/programming";
import { IndexedDbService, StoredProject } from "../src";
const FDBFactory = require("fake-indexeddb/lib/FDBFactory");

const projectName = "TestProject";

const project: StoredProject = {
	name: projectName,
	lastOpened: new Date(),
	source: "in-memory"
};

const files: File[] = [createFile("a.ts"), createFile("b.ts"), createFile("c.ts")];

describe("IndexedDbService", () => {
	let service: IndexedDbService;

	beforeEach(() => {
		service = new IndexedDbService(new FDBFactory());
	});
	it("Should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("projects", () => {
		describe("saveProject", () => {
			it("Empty database -> Adds project and files", async () => {
				await service.projects.saveProject(project, files);

				const [retrievedProject, retrievedFiles] = await Promise.all([
					service.projects.getByName(project.name),
					service.files.getFiles(project.name)
				]);

				expect(retrievedProject).toEqual(project);
				expect(retrievedFiles).toEqual(files);
			});

			it("Project already exists -> Updates project and replaces files", async () => {
				await service.projects.saveProject(project, files);

				const updatedProject: StoredProject = {
					...project,
					lastOpened: new Date(2022)
				};

				const updatedFiles: File[] = [createFile("new-file.ts")];

				await service.projects.saveProject(updatedProject, updatedFiles);

				const [retrievedProject, retrievedFiles] = await Promise.all([
					service.projects.getByName(project.name),
					service.files.getFiles(project.name)
				]);

				expect(retrievedProject).toEqual(updatedProject);
				expect(retrievedFiles).toEqual(updatedFiles);
			});
		});

		describe("put", () => {
			it("Project does not exist -> Project is added", async () => {
				const projectBefore = await service.projects.getMany();
				await service.projects.put(project);
				const projectsAfter = await service.projects.getMany();

				expect(projectBefore).toEqual([]);
				expect(projectsAfter).toEqual([project]);
			});

			it("Project exists -> Project is updated", async () => {
				await service.projects.put(project);
				const [original] = await service.projects.getMany();

				const updatedProject: StoredProject = {
					...project,
					lastOpened: new Date(2021, 1, 1)
				};

				await service.projects.put(updatedProject);

				const projects = await service.projects.getMany();

				expect(projects.length).toEqual(1);
				expect(original).toEqual(project);
				expect(projects[0]).toEqual(updatedProject);
			});
		});

		describe("getMany", () => {
			it("Empty database -> Returns empty array", async () => {
				const projects = await service.projects.getMany();
				expect(projects.length).toEqual(0);
			});

			it("Returns projects sorted by 'lastOpened'", async () => {
				await Promise.all([
					service.projects.put({
						name: "A (should be #3)",
						source: "in-memory",
						lastOpened: new Date(2019)
					}),
					service.projects.put({
						name: "B (should be #1)",
						source: "in-memory",
						lastOpened: new Date(2021)
					}),
					service.projects.put({
						name: "C (should be #2)",
						source: "in-memory",
						lastOpened: new Date(2020)
					})
				]);

				const projects = await service.projects.getMany();

				expect(projects.length).toEqual(3);
				expect(projects[0].name).toEqual("B (should be #1)");
				expect(projects[1].name).toEqual("C (should be #2)");
				expect(projects[2].name).toEqual("A (should be #3)");
			});
		});

		describe("getByName", () => {
			it("Project does not exist -> Returns undefined", async () => {
				const doesNotExist = await service.projects.getByName("doesNotExist");
				expect(doesNotExist).toBeUndefined();
			});

			it("Existing project -> Returns project", async () => {
				await service.projects.put(project);
				const retrievedProject = await service.projects.getByName(project.name);
				expect(retrievedProject).toEqual(project);
			});
		});

		describe("delete", () => {
			it("Deletes project and associated files", async () => {
				await service.projects.saveProject(project, files);
				await service.files.put("Unrelated Project", createFile("unrelated-file.ts"));

				const [projectBefore, filesBefore] = await Promise.all([
					service.projects.getByName(project.name),
					service.files.getFiles(project.name)
				]);

				await service.projects.delete(project.name);

				const [projectAfter, filesAfter, unrelatedFiles] = await Promise.all([
					service.projects.getByName(project.name),
					service.files.getFiles(project.name),
					service.files.getFiles("Unrelated Project")
				]);

				expect(projectBefore).toBeDefined();
				expect(filesBefore.length).toBeGreaterThan(0);
				expect(projectAfter).toBeUndefined();
				expect(filesAfter).toEqual([]);
				expect(unrelatedFiles.length).toEqual(1);
			});
		});
	});

	describe("files", () => {
		describe("put", () => {
			it("File does not exist -> Adds file", async () => {
				const newFile = createFile("new-file.ts");
				await service.files.put(project.name, newFile);
				const retrievedFiles = await service.files.getFiles(project.name);
				expect(retrievedFiles).toEqual([newFile]);
			});

			it("File exists -> Updates file", async () => {
				const existingFile = createFile(
					"existing-file.ts",
					undefined,
					"// original content"
				);
				await service.files.put(project.name, existingFile);
				const [beforeUpdate] = await service.files.getFiles(project.name);

				const updatedFile: File = {
					...existingFile,
					content: "// updated content"
				};

				await service.files.put(project.name, updatedFile);

				const [afterUpdate] = await service.files.getFiles(project.name);

				expect(beforeUpdate).toEqual(existingFile);
				expect(afterUpdate).toEqual(updatedFile);
			});
		});

		describe("getFiles", () => {
			it("Returns all files of a project", async () => {
				const file = files[0];
				const unrelatedFile = createFile("unrelated-file.ts");

				await Promise.all([
					service.files.put(project.name, file),
					service.files.put("Unrelated project", unrelatedFile)
				]);

				const filesOfProject = await service.files.getFiles(project.name);

				expect(filesOfProject).toEqual([file]);
			});
		});

		describe("delete", () => {
			it("Deletes the file", async () => {
				const file = files[0];
				await service.files.put(project.name, file);
				const filesBefore = await service.files.getFiles(project.name);
				await service.files.delete(project.name, file.path);
				const filesAfter = await service.files.getFiles(project.name);
				expect(filesBefore.length).toEqual(1);
				expect(filesAfter.length).toEqual(0);
			});
		});
	});
});
