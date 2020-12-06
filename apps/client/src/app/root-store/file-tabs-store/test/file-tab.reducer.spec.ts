import { reducer, initialState } from "../file-tab.reducer";

describe("FileTab Reducer", () => {
	describe("an unknown action", () => {
		it("should return the previous state", () => {
			const action = {} as any;

			const result = reducer(initialState, action);

			expect(result).toBe(initialState);
		});
	});
});
