import * as fromFileTab from "../file-tab.reducer";
import { selectFileTabState } from "../file-tab.selectors";

describe("FileTab Selectors", () => {
	it("should select the feature state", () => {
		const result = selectFileTabState({
			[fromFileTab.fileTabFeatureKey]: {}
		});

		expect(result).toEqual({});
	});
});
