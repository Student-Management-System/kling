import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { UnsubscribeOnDestroy } from "../../../../shared/components/unsubscribe-on-destroy.component";
import { TerminalService } from "../../services/terminal.service";

@Component({
	selector: "app-terminal",
	templateUrl: "./terminal.component.html",
	styleUrls: ["./terminal.component.scss"]
})
export class TerminalComponent extends UnsubscribeOnDestroy implements OnInit {
	output$: Observable<{ stderr: string; stdout: string }>;

	constructor(readonly terminalService: TerminalService) {
		super();
	}

	ngOnInit(): void {
		this.output$ = this.terminalService._output$;
	}
}
