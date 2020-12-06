import { FormGroup } from "@angular/forms";

/**
 * Class that can be inherited by components, that contain forms which represent
 * a specific model (type).
 */
export abstract class AbstractForm<T> {
	constructor() {}

	/** Form representing the structure of the specified type. */
	form: FormGroup;

	/** Returns the Model represented by the form. */
	getModel(): T {
		return this.form.value as T;
	}

	/** Tries to apply the update to the form. */
	patchModel(update: unknown): void {
		this.form.patchValue(update);
	}

	/** Indicates, wether the form contains errors. */
	isInvalid(): boolean {
		return this.form.invalid;
	}
}
