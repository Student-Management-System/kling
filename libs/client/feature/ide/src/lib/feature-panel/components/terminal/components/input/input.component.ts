import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { MatFormField } from "@angular/material/form-field";
import { WorkspaceService } from "@kling/ide-services";

@Component({
	selector: "kling-terminal-input",
	templateUrl: "./input.component.html",
	styleUrls: ["./input.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TerminalInputComponent implements OnInit {
	@ViewChild("formField") stdinInput: MatFormField;

	constructor(private readonly workspace: WorkspaceService) {}

	ngOnInit(): void {}

	setInput(content: string): void {
		this.workspace.setStdin(content);
	}
}
