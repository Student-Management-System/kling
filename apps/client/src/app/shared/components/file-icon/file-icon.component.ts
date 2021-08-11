import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
	selector: "app-file-icon",
	templateUrl: "./file-icon.component.html",
	styleUrls: ["./file-icon.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileIconComponent {
	@Input() language: string;
}
