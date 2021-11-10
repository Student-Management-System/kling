import { OverlayContainer } from "@angular/cdk/overlay";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ThemeService } from "@web-ide/client/shared/services";
import { tap } from "rxjs";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
	theme$ = this.theme.theme$.pipe(tap(t => this.onThemeChange(t)));

	constructor(
		private readonly theme: ThemeService,
		private readonly overlayContainer: OverlayContainer
	) {}

	private onThemeChange(theme: string): void {
		const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;

		if (theme === "dark") {
			overlayContainerClasses.remove("light");
		} else if (theme === "light") {
			overlayContainerClasses.remove("dark");
		} else {
			console.error("Unknown theme: " + theme);
		}

		overlayContainerClasses.add(theme);
	}
}
