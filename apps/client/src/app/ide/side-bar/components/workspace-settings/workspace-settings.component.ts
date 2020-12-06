import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatSelectChange } from "@angular/material/select";
import { Store } from "@ngrx/store";
import { WorkspaceActions, WorkspaceSelectors } from "../../../../root-store";
import { UnsubscribeOnDestroy } from "../../../../shared/components/unsubscribe-on-destroy.component";

@Component({
	selector: "app-workspace-settings",
	templateUrl: "./workspace-settings.component.html",
	styleUrls: ["./workspace-settings.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceSettingsComponent extends UnsubscribeOnDestroy implements OnInit {
	language$ = this.store.select(WorkspaceSelectors.selectLanguage);
	theme$ = this.store.select(WorkspaceSelectors.selectTheme);

	constructor(private store: Store) {
		super();
	}

	ngOnInit(): void {}

	onLanguageChange(event: MatSelectChange): void {
		this.store.dispatch(WorkspaceActions.setLanguage({ language: event.value }));
	}

	onThemeChange(event: MatSelectChange): void {
		this.store.dispatch(WorkspaceActions.setTheme({ theme: event.value }));
	}
}
