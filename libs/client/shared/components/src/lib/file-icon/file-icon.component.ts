import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
	selector: "kling-file-icon",
	templateUrl: "./file-icon.component.html",
	styleUrls: ["./file-icon.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileIconComponent {
	@Input() language: string | null | undefined;
}
