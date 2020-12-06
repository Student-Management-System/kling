import * as fromWorkspace from "./workspace.reducer";
import { selectWorkspaceState } from "./workspace.selectors";

describe("Workspace Selectors", () => {
	it("should select the feature state", () => {
		const result = selectWorkspaceState({
			[fromWorkspace.workspaceFeatureKey]: {}
		});

		expect(result).toEqual({});
	});
});
