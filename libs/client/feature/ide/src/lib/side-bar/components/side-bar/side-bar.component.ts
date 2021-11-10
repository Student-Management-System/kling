import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { WorkspaceSettingsService } from "@web-ide/ide-services";

@Component({
	selector: "web-ide-side-bar",
	templateUrl: "./side-bar.component.html",
	styleUrls: ["./side-bar.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideBarComponent implements OnInit {
	constructor(public settings: WorkspaceSettingsService) {}

	ngOnInit(): void {}
}
