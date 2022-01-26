import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MiddleClickModule, ProgrammingLanguageModule } from "@web-ide/client-shared";
import { FileIconModule, IconModule } from "@web-ide/client/shared/components";
import { TranslateModule } from "@ngx-translate/core";
import { ContextMenuModule } from "@perfectmemory/ngx-contextmenu";
import { FileComponent } from "./file.component";

@NgModule({
	declarations: [FileComponent],
	imports: [
		CommonModule,
		ContextMenuModule,
		IconModule,
		FileIconModule,
		ProgrammingLanguageModule,
		TranslateModule,
		MiddleClickModule
	],
	exports: [FileComponent]
})
export class FileModule {}
