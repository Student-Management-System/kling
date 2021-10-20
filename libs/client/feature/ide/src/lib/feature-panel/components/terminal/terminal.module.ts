import { NgModule } from "@angular/core";
import { TerminalInput } from "./components/input/input.component";
import { TerminalComponent } from "./components/terminal/terminal.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";

@NgModule({
	declarations: [TerminalComponent, TerminalInput],
	imports: [CommonModule, MatProgressSpinnerModule, TranslateModule],
	exports: [TerminalComponent]
})
export class TerminalModule {}
