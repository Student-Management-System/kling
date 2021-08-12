import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
	selector: "app-run-code",
	templateUrl: "./run-code.component.html",
	styleUrls: ["./run-code.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RunCodeComponent {
	run(): void {
		// TODO
	}
}
