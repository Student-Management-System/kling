import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

type Theme = "dark" | "light";

@Injectable({ providedIn: "root" })
export class ThemeService {
	private themeSubject: BehaviorSubject<Theme>;
	theme$: Observable<Theme>;

	constructor() {
		const storedTheme = localStorage.getItem("theme");
		const theme = (storedTheme ?? "dark") as Theme;
		this.themeSubject = new BehaviorSubject(theme);
		this.theme$ = this.themeSubject
			.asObservable()
			.pipe(distinctUntilChanged((x, y) => x === y));
	}

	/**
	 * Emits the new theme via `theme$` and stores it in the storage.
	 * Theme must be included in `availableThemes`.
	 */
	setTheme(cssClass: Theme): void {
		localStorage.setItem("theme", cssClass);
		this.themeSubject.next(cssClass);
	}
}
