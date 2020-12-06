import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
	constructor(private translate: TranslateService) {}

	handleLanguageChange(lang: string): void {
		this.translate.use(lang);
		localStorage.setItem("language", lang);
	}
}
