import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { UnsubscribeOnDestroy } from "@kling/client/shared/components";
import { CollaborationService } from "@kling/collaboration";
import { WorkspaceService } from "@kling/ide-services";

@Component({
	selector: "kling-terminal-input",
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
			if (this.hasActiveSession && !sessionId) {
				this.collaboration.getStdin().removeAllListeners();
			}

			this.hasActiveSession = !!sessionId;

			if (this.hasActiveSession) {
				this.setTextAreaValue();

				this.collaboration.getStdin().on("value", () => {
					this.setTextAreaValue();
				});
			}
		});
	}

	private setTextAreaValue() {
		this.textAreaValue = this.collaboration.getStdin().value();
		this.workspace.setStdin(this.textAreaValue);
		this.cdRef.detectChanges();
	}

	setInput(content: string): void {
		this.workspace.setStdin(content);

		if (this.hasActiveSession) {
			this.collaboration.getStdin().value(content);
		}
	}
}
