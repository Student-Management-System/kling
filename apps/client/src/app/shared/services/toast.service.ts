import { Injectable } from "@angular/core";
import { ToastrService, IndividualConfig } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";

type InterpolatedParams = Record<string, string | number>;

@Injectable({ providedIn: "root" })
export class ToastService {
	constructor(private toast: ToastrService, private translate: TranslateService) {}

	/** Displays a success-themed toast message. */
	success(
		message?: string,
		title = "Message.Success",
		interpolatedParams?: InterpolatedParams,
		override?: Partial<IndividualConfig>
	): void {
		this.toast.success(
			this.tryGetTranslation(message, interpolatedParams),
			this.tryGetTranslation(title),
			override
		);
	}

	/** Displays an error-themed toast message. */
	error(
		message?: string,
		title?: string,
		interpolatedParams?: InterpolatedParams,
		override?: Partial<IndividualConfig>
	): void {
		this.toast.error(
			this.tryGetTranslation(message, interpolatedParams),
			this.tryGetTranslation(title),
			override
		);
	}

	/**
	 * Opens an error-themed toast and logs the error to the console.
	 * The error text will be determined by the error.
	 */
	apiError(error: HttpErrorResponse, title?: string): void {
		console.log(error);
		const exception = error?.error?.error;
		const translation = exception
			? this.translate.instant("Error." + exception)
			: this.translate.instant("Error.Unknown");
		this.error(translation, title);
	}

	/** Displays a warning-themed toast message. */
	warning(
		message?: string,
		title?: string,
		interpolatedParams?: InterpolatedParams,
		override?: Partial<IndividualConfig>
	): void {
		this.toast.warning(
			this.tryGetTranslation(message, interpolatedParams),
			this.tryGetTranslation(title),
			override
		);
	}

	/** Displays an info-themed toast message. */
	info(
		message?: string,
		title?: string,
		interpolatedParams?: InterpolatedParams,
		override?: Partial<IndividualConfig>
	): void {
		this.toast.info(
			this.tryGetTranslation(message, interpolatedParams),
			this.tryGetTranslation(title),
			override
		);
	}

	/**
	 * Tries to find the translation of the given `word`.
	 * Returns `undefined` if no translation found or word was undefined.
	 */
	private tryGetTranslation(word?: string, params?: InterpolatedParams): string {
		return word ? this.translate.instant(word, params) : undefined;
	}
}
