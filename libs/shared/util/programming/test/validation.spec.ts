import { isProjectNameValid } from "@web-ide/programming";

describe("Validation", () => {
	describe("isProjectNameValid", () => {
		it.each([
			// ProjectName - Valid - Reason
			["abc", true, null],
			["ABC", true, null],
			["aBc", true, null],
			["", false, "Error.ValueMissing"],
			["a/b", false, "Error.ForbiddenCharacter"],
			["a\\b", false, "Error.ForbiddenCharacter"],
			["a@b", false, "Error.ForbiddenCharacter"],
			["a.b", false, "Error.ForbiddenCharacter"],
			["a,b", false, "Error.ForbiddenCharacter"],
			["a#b", false, "Error.ForbiddenCharacter"],
			[" ", false, "Error.ForbiddenCharacter"],
			[" ab", false, "Error.ForbiddenCharacter"],
			["ab ", false, "Error.ForbiddenCharacter"]
		])("%s -> %s", (projectName, valid, reason) => {
			const result = isProjectNameValid(projectName);
			expect(result.valid).toEqual(valid);
			expect(result.reason).toEqual(reason);
		});
	});
});
