import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { WorkspaceSettingsService } from "../../../services/workspace-settings.service";

@Component({
	selector: "app-side-bar",
	templateUrl: "./side-bar.component.html",
	styleUrls: ["./side-bar.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideBarComponent implements OnInit {
	constructor(public settings: WorkspaceSettingsService) {}

	ngOnInit(): void {}
}
