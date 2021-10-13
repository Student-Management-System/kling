import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatSelectChange } from "@angular/material/select";
import { UnsubscribeOnDestroy, ThemeService, ToastService } from "@kling/client-shared";
import { TranslateService } from "@ngx-translate/core";

@Component({
	selector: "kling-workspace-settings",
	templateUrl: "./workspace-settings.component.html",
	styleUrls: ["./workspace-settings.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceSettingsComponent extends UnsubscribeOnDestroy implements OnInit {
	theme$ = this.themeService.theme$;
	language = localStorage.getItem("language") ?? "en";

	constructor(
		private themeService: ThemeService,
		private toast: ToastService,
		private translate: TranslateService
	) {
		super();
	}

	ngOnInit(): void {}

	onThemeChange(event: MatSelectChange): void {
		const theme = event.value as "dark" | "light";
		this.themeService.setTheme(theme);

		this.toast.info("Please reload your page to update editor theme ... TODO recreate editor");
	}

	onLanguageChange(event: MatSelectChange): void {
		this.translate.use(event.value);
		localStorage.setItem("language", event.value);
		this.language = event.value;
	}
}
