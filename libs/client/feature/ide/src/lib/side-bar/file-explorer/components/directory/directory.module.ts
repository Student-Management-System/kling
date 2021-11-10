import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { IconModule } from "@web-ide/client/shared/components";
import { TranslateModule } from "@ngx-translate/core";
import { ContextMenuModule } from "ngx-contextmenu";
import { FileModule } from "../file/file.module";
import { DirectoryComponent } from "./directory.component";

@NgModule({
	declarations: [DirectoryComponent],
	imports: [
		CommonModule,
		ContextMenuModule,
		IconModule,
		FileModule,
		TranslateModule,
		DragDropModule
	],
	exports: [DirectoryComponent]
})
export class DirectoryModule {}
