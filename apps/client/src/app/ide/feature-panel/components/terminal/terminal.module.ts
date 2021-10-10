import { NgModule } from "@angular/core";
import { SharedModule } from "apps/client/src/app/shared/shared.module";
import { TerminalComponent } from "./components/terminal/terminal.component";
import { TerminalInput } from "./components/input/input.component";

@NgModule({
	declarations: [TerminalComponent, TerminalInput],
	imports: [SharedModule],
	exports: [TerminalComponent]
})
export class TerminalModule {}
