import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IconModule } from "../..";
import { FileIconComponent } from "./file-icon.component";

@NgModule({
	declarations: [FileIconComponent],
	imports: [CommonModule, IconModule],
	exports: [FileIconComponent]
})
export class FileIconModule {}
