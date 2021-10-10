import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from "@angular/core";
import { MatFormField } from "@angular/material/form-field";
import { WorkspaceService } from "apps/client/src/app/ide/services/workspace.service";
import { BehaviorSubject } from "rxjs";

@Component({
	selector: "app-terminal-input",
	templateUrl: "./input.component.html",
	styleUrls: ["./input.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TerminalInput implements OnInit {
	@ViewChild("formField") stdinInput: MatFormField;

	stdinPresets$ = new BehaviorSubject<string[]>([""]);
	selectedPreset = 0;

	constructor(private readonly workspace: WorkspaceService) {}

	ngOnInit(): void {}

	setInput(content: string): void {
		this.workspace.setStdin(content);
	}
}
