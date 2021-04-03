import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { NgTerminal } from "ng-terminal";
import { TerminalFacade } from "../../services/terminal.facade";

@Component({
	selector: "app-terminal",
	templateUrl: "./terminal.component.html",
	styleUrls: ["./terminal.component.scss"]
})
export class TerminalComponent implements OnInit, AfterViewInit {
	@ViewChild("terminal", { static: true }) terminal: NgTerminal;

	constructor(private terminalFacade: TerminalFacade) {}

	ngOnInit(): void {
		this.terminalFacade.write$.subscribe(text => {
			// const date = new Date();
			// const minutes = date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes();
			this.terminal.underlying.writeln(`${text}`);
		});

		this.terminalFacade.clear$.subscribe(() => {
			this.terminal.underlying.clear();
		});
	}

	ngAfterViewInit(): void {
		this.terminal.underlying.setOption("theme", {
			background: "#252526"
		});

		this.terminal.underlying.writeln('Press "Run" to execute your code.');

		// this.terminal.keyEventInput.subscribe(e => {
		// 	// console.log("keyboard event:" + e.domEvent.keyCode + ", " + e.key);

		// 	const ev = e.domEvent;
		// 	const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

		// 	if (ev.keyCode === 13) {
		// 		this.terminal.write("\r\n$ ");
		// 	} else if (ev.keyCode === 8) {
		// 		// Do not delete the prompt
		// 		if (this.terminal.underlying.buffer.active.cursorX > 2) {
		// 			this.terminal.write("\b \b");
		// 		}
		// 	} else if (printable) {
		// 		this.terminal.write(e.key);
		// 	}
		// });
	}
}
