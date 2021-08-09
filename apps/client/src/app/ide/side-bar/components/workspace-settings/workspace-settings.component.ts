import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatSelectChange } from "@angular/material/select";
import { WorkspaceActions, WorkspaceSelectors } from "@kling/client/data-access/state";
import { Store } from "@ngrx/store";
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
	language$ = this.store.select(WorkspaceSelectors.selectLanguage);
	theme$ = this.store.select(WorkspaceSelectors.selectTheme);

	constructor(
		private store: Store,
		private themeService: ThemeService,
		private toast: ToastService
	) {
		super();
	}

	ngOnInit(): void {}

	onLanguageChange(event: MatSelectChange): void {
		this.store.dispatch(WorkspaceActions.setLanguage({ language: event.value }));
	}

	onThemeChange(event: MatSelectChange): void {
		const theme = event.value as "dark" | "light";
		this.store.dispatch(WorkspaceActions.setTheme({ theme }));

		if (theme === "light") {
			this.themeService.setTheme("default-theme");
		} else {
			this.themeService.setTheme("dark-theme");
		}

		this.toast.info(
			"Please reload your page to update syntax highlighting theme ... TODO recreate editor"
		);
	}
}
