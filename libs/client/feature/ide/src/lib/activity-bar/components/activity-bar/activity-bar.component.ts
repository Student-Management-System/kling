import { ChangeDetectionStrategy, Component } from "@angular/core";
import { SidenavService } from "@kling/client/shared/services";
import { WorkspaceSettingsService } from "@kling/ide-services";

type Tab = "EXPLORER" | "HISTORY";

@Component({
	selector: "kling-activity-bar",
	templateUrl: "./activity-bar.component.html",
	styleUrls: ["./activity-bar.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityBarComponent {
	constructor(public sidenav: SidenavService, public settings: WorkspaceSettingsService) {}

	onTabClick(clickedTab: Tab): void {
		this.settings.switchSideBarTabOrClose(clickedTab);
	}
}
