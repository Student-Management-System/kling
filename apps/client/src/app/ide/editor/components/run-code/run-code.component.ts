import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";

@Component({
	selector: "app-run-code",
	templateUrl: "./run-code.component.html",
	styleUrls: ["./run-code.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RunCodeComponent {
	@Output() onRun = new EventEmitter<void>();
}
