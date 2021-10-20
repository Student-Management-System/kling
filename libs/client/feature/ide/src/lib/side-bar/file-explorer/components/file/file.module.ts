import { NgModule } from "@angular/core";
import { MiddleClickModule, ProgrammingLanguageModule } from "@kling/client-shared";
import { FileIconModule, IconModule } from "@kling/client/shared/components";
import { TranslateModule } from "@ngx-translate/core";
import { ContextMenuModule } from "ngx-contextmenu";
import { FileComponent } from "./file.component";

@NgModule({
	declarations: [FileComponent],
	imports: [
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
