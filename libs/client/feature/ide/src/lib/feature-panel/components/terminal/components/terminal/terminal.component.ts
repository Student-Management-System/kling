import { Component } from "@angular/core";
import { TerminalService } from "../../../../services/terminal.service";

@Component({
	selector: "kling-terminal",
	templateUrl: "./terminal.component.html",
	styleUrls: ["./terminal.component.scss"]
})
export class TerminalComponent {
	output$ = this.terminalService._output$;
	displayLoadingIndicator$ = this.terminalService.displayLoadingIndicator$;

	constructor(readonly terminalService: TerminalService) {}
}
