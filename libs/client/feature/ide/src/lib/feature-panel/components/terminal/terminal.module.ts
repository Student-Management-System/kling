import { NgModule } from "@angular/core";
import { SharedModule } from "@kling/client-shared";
import { TerminalInput } from "./components/input/input.component";
import { TerminalComponent } from "./components/terminal/terminal.component";

@NgModule({
	declarations: [TerminalComponent, TerminalInput],
	imports: [SharedModule],
	exports: [TerminalComponent]
})
export class TerminalModule {}
