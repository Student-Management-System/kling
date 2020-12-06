import { Component, OnInit, ChangeDetectionStrategy, Input } from "@angular/core";

@Component({
	selector: "app-side-bar-section",
	templateUrl: "./side-bar-section.component.html",
	styleUrls: ["./side-bar-section.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideBarSectionComponent implements OnInit {
	@Input() isExpanded = true;

	constructor() {}

	ngOnInit(): void {}

	toggleIsExpanded(): void {
		this.isExpanded = !this.isExpanded;
	}
}
