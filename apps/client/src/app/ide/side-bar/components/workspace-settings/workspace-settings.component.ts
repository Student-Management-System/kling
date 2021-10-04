import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatSelectChange } from "@angular/material/select";
import { WorkspaceActions, WorkspaceSelectors } from "@kling/client/data-access/state";
import { Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { UnsubscribeOnDestroy } from "../../../../shared/components/unsubscribe-on-destroy.component";
import { ThemeService } from "../../../../shared/services/theme.service";
import { ToastService } from "../../../../shared/services/toast.service";

@Component({
	selector: "app-workspace-settings",
	templateUrl: "./workspace-settings.component.html",
	styleUrls: ["./workspace-settings.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceSettingsComponent extends UnsubscribeOnDestroy implements OnInit {
	theme$ = this.store.select(WorkspaceSelectors.selectTheme);
	language = localStorage.getItem("language") ?? "en";

	constructor(
		private store: Store,
		private themeService: ThemeService,
		private toast: ToastService,
		private translate: TranslateService
	) {
		super();
	}

	ngOnInit(): void {}

	onThemeChange(event: MatSelectChange): void {
		const theme = event.value as "dark" | "light";
		this.store.dispatch(WorkspaceActions.setTheme({ theme }));
		this.themeService.setTheme(theme);

		this.toast.info(
			"Please reload your page to update syntax highlighting theme ... TODO recreate editor"
		);
	}

	onLanguageChange(event: MatSelectChange): void {
		this.translate.use(event.value);
		localStorage.setItem("language", event.value);
		this.language = event.value;
	}
}
