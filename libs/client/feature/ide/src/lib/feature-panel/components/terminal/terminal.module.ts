import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TranslateModule } from "@ngx-translate/core";
import { TerminalInput } from "./components/input/input.component";
import { TerminalComponent } from "./components/terminal/terminal.component";

@NgModule({
	declarations: [TerminalComponent, TerminalInput],
	imports: [CommonModule, MatProgressSpinnerModule, MatInputModule, TranslateModule],
	exports: [TerminalComponent]
})
export class TerminalModule {}
