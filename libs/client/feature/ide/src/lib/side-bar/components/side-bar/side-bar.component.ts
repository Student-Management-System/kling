import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { WorkspaceSettingsService } from "@kling/ide-services";

@Component({
	selector: "kling-side-bar",
	templateUrl: "./side-bar.component.html",
	styleUrls: ["./side-bar.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideBarComponent implements OnInit {
	constructor(public settings: WorkspaceSettingsService) {}

	ngOnInit(): void {}
}
