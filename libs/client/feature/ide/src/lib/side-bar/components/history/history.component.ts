import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

@Component({
	selector: "kling-history",
	templateUrl: "./history.component.html",
	styleUrls: ["./history.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
