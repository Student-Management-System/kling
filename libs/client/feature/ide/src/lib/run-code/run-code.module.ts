import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RunCodeComponent } from "./run-code.component";
import { IconModule } from "@kling/client/shared/components";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [RunCodeComponent],
	imports: [CommonModule, IconModule, TranslateModule],
	exports: [RunCodeComponent]
})
export class RunCodeModule {}
