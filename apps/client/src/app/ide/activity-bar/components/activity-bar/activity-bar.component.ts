import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { SidenavService } from "../../../../shared/services/sidenav.service";
import { WorkspaceSettingsService } from "../../../services/workspace-settings.service";

type Tab = "EXPLORER" | "HISTORY";

@Component({
	selector: "app-activity-bar",
	templateUrl: "./activity-bar.component.html",
	styleUrls: ["./activity-bar.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityBarComponent implements OnInit {
	constructor(public sidenav: SidenavService, public settings: WorkspaceSettingsService) {}

	ngOnInit(): void {}

	onTabClick(clickedTab: Tab): void {
		this.settings.switchSideBarTabOrClose(clickedTab);
	}
}
