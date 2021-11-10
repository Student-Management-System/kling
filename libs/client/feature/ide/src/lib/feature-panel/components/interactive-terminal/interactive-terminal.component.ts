import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	NgModule,
	OnInit
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FileSelectors, WorkspaceSelectors } from "@web-ide/client/data-access/state";
import { UnsubscribeOnDestroy } from "@web-ide/client/shared/components";
import { ToastService } from "@web-ide/client/shared/services";
import { CodeExecutionService } from "@web-ide/ide-services";
import { Store } from "@ngrx/store";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { firstValueFrom } from "rxjs";

type Line = { content: string; stream: "stdout" | "stderr" | "stdin" };

@Component({
	selector: "web-ide-interactive-terminal",
	templateUrl: "interactive-terminal.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InteractiveTerminalComponent extends UnsubscribeOnDestroy implements OnInit {
	input = "";
	lines: Line[] = [];
	isRunning$ = this.codeExecution.isRunning$;

	inputPlaceholder: string;

	constructor(
		private readonly store: Store,
		private readonly codeExecution: CodeExecutionService,
		private readonly translate: TranslateService,
		private readonly toast: ToastService,
		private readonly cdRef: ChangeDetectorRef
	) {
		super();
	}

	ngOnInit(): void {
		this.inputPlaceholder = this.translate.instant("Text.Terminal.InputPlaceholder");

		this.subs.sink = this.codeExecution.interactiveMessage$.subscribe(message => {
			console.log(message);

			if (message.data) {
				const _lines: Line[] = message.data.split("\n").map(line => ({
					content: line,
					stream: message.stream
				}));
				this.lines.push(..._lines);
				this.cdRef.detectChanges();
			}

			if (message.signal) {
				this.lines.push({
					content: "Process terminated: " + message.signal,
					stream: "stderr"
				});
			}
		});
	}

	async run(): Promise<void> {
		this.lines = [];

		const files = await firstValueFrom(this.store.select(FileSelectors.selectAllFiles));
		const selectedFilePath = await firstValueFrom(
			this.store.select(FileSelectors.selectSelectedFilePath)
		);
		const entryPoint = await firstValueFrom(
			this.store.select(WorkspaceSelectors.selectEntryPoint)
		);

		const mainFilePath = entryPoint ?? selectedFilePath;

		if (!mainFilePath) {
			console.log("no main file");
		}

		const [mainFile] = files.filter(f => f.path === selectedFilePath);

		try {
			await this.codeExecution.executeInteractively(files, mainFile);
			document.getElementById("stdin-input").focus();
		} catch (error) {
			console.error(error);
			this.toast.error("Error.SomethingWentWrong");
		}
	}

	stop(): void {
		this.codeExecution.sendSignal("SIGKILL");
	}

	onInput(): void {
		const content = this.input;
		this.input = "";
		this.lines.push({ content, stream: "stdin" });
		this.codeExecution.writeToStdin(content);
	}
}

@NgModule({
	declarations: [InteractiveTerminalComponent],
	imports: [CommonModule, FormsModule, TranslateModule],
	exports: [InteractiveTerminalComponent]
})
export class InteractiveTerminalModule {}
