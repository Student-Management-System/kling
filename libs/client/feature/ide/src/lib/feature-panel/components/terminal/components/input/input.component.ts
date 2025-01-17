import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { UnsubscribeOnDestroy } from "@web-ide/client/shared/components";
import { CollaborationService } from "@web-ide/collaboration";
import { WorkspaceService } from "@web-ide/ide-services";

@Component({
	selector: "web-ide-terminal-input",
	templateUrl: "./input.component.html",
	styleUrls: ["./input.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TerminalInputComponent extends UnsubscribeOnDestroy implements OnInit {
	textAreaValue = "";
	private hasActiveSession = false;

	constructor(
		private readonly workspace: WorkspaceService,
		private readonly collaboration: CollaborationService,
		private readonly cdRef: ChangeDetectorRef
	) {
		super();
	}

	ngOnInit(): void {
		this.subs.sink = this.collaboration.activeSessionId$.subscribe(sessionId => {
			this.hasActiveSession = !!sessionId;

			if (this.hasActiveSession) {
				this.setTextAreaValue();

				this.collaboration.getRealTimeTerminalInput().on("value", () => {
					this.setTextAreaValue();
				});
			}
		});
	}

	private setTextAreaValue() {
		this.textAreaValue = this.collaboration.getRealTimeTerminalInput().value();
		this.workspace.setStdin(this.textAreaValue);
		this.cdRef.detectChanges();
	}

	setInput(content: string): void {
		this.workspace.setStdin(content);

		if (this.hasActiveSession) {
			this.collaboration.getRealTimeTerminalInput().value(content);
		}
	}
}
