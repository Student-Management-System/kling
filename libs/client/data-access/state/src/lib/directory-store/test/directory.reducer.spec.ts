import { reducer, initialState } from "../directory.reducer";

describe("Directory Reducer", () => {
	describe("Unknown action", () => {
		it("Return the previous state", () => {
			const action = {} as any;
			const result = reducer(initialState, action);
			expect(result).toBe(initialState);
		});
	});
});
