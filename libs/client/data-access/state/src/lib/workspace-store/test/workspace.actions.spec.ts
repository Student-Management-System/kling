import * as fromWorkspace from "../workspace.actions";

describe("loadWorkspaces", () => {
	it("should return an action", () => {
		expect(fromWorkspace.loadWorkspaces().type).toBe("[Workspace] Load Workspaces");
	});
});
