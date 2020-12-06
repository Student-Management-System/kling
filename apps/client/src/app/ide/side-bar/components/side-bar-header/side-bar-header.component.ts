import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

@Component({
	selector: "app-side-bar-header",
	templateUrl: "./side-bar-header.component.html",
	styleUrls: ["./side-bar-header.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideBarHeaderComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
