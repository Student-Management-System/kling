import { ChangeDetectionStrategy, Component } from "@angular/core";
import { WorkspaceSettingsService } from "@web-ide/ide-services";

type Tab = "EXPLORER";

@Component({
	selector: "web-ide-activity-bar",
	templateUrl: "./activity-bar.component.html",
	styleUrls: ["./activity-bar.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityBarComponent {
	constructor(public settings: WorkspaceSettingsService) {}

	onTabClick(clickedTab: Tab): void {
		this.settings.switchSideBarTabOrClose(clickedTab);
	}
}
