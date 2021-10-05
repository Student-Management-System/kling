export type ValidationResult = {
	valid: boolean;
	reason: string | null;
};

function InvalidResult(reason: string): ValidationResult {
	return { valid: false, reason };
}

export const forbiddenCharacters = ["/", "\\", ".", ",", "@", "#"];

export function isProjectNameValid(projectName: string): ValidationResult {
	return isNameValid(projectName);
}

export function isNameValid(name: string): ValidationResult {
	if (!(name?.length > 0)) {
		return InvalidResult("Error.ValueMissing");
	}

	if (name.startsWith(" ") || name.endsWith(" ")) {
		return InvalidResult("Error.ForbiddenCharacter");
	}

	for (const char of name) {
		if (forbiddenCharacters.includes(char)) {
			return InvalidResult("Error.ForbiddenCharacter");
		}
	}

	return { valid: true, reason: null };
}
