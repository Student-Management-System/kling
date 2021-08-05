import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
	selector: "app-problem-view",
	templateUrl: "./problem-view.component.html",
	styleUrls: ["./problem-view.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProblemViewComponent implements OnInit {
	title = "Find the maximum subarray";
	mdSrc = "";
	"http://localhost:3000/postings/winf-1920/file";
	mdContent: string;

	constructor() {}

	ngOnInit(): void {}

	onLoaded(event: string): void {
		const toRemove = event.split("\n")[0];
		this.mdContent = event.replace("```", "");
		this.mdContent = event.replace(toRemove, "");
	}
}
