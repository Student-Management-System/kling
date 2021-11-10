import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RunCodeComponent } from "./run-code.component";
import { IconModule } from "@web-ide/client/shared/components";
import { TranslateModule } from "@ngx-translate/core";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
	declarations: [RunCodeComponent],
	imports: [CommonModule, IconModule, TranslateModule, MatTooltipModule],
	exports: [RunCodeComponent]
})
export class RunCodeModule {}
