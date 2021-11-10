import { createDirectory, createFile } from "@web-ide/programming";

export const defaultProject = {
	files: [
		createFile("root-1.ts"),
		createFile("root-2.ts"),
		createFile("level-1-a-1.ts", "level-1-a"),
		createFile("level-1-a-2.ts", "level-1-a"),
		createFile("level-1-b.ts", "level-1-b"),
		createFile("level-2.ts", "level-1-a/level-2")
	],
	directories: [
		createDirectory("level-1-a"),
		createDirectory("level-1-b"),
		createDirectory("level-2", "level-1-a")
	],
	projectName: "test-project"
};

/** Uses `indexed-db` to create a default project. */
export function createDefaultProject(): void {
	cy.useIndexedDbService(async idb => {
		await idb.projects.saveProject(
			{
				lastOpened: new Date(),
				source: "in-memory",
				name: defaultProject.projectName
			},
			defaultProject.files
		);
	});
}
