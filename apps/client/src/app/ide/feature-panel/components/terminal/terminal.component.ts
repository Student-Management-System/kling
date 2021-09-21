import { Component } from "@angular/core";
import { WorkspaceService } from "../../../services/workspace.service";
import { TerminalService } from "../../services/terminal.service";

@Component({
	selector: "app-terminal",
	templateUrl: "./terminal.component.html",
	styleUrls: ["./terminal.component.scss"]
})
export class TerminalComponent {
	output$ = this.terminalService._output$;

	constructor(
		readonly terminalService: TerminalService,
		private readonly workspace: WorkspaceService
	) {}

	setInput(content: string): void {
		this.workspace.setStdin(content);
	}
}
