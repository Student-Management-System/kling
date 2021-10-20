import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ContextMenuModule } from "ngx-contextmenu";
import { DirectoryModule } from "./components/directory/directory.module";
import { FileExplorerComponent } from "./components/file-explorer/file-explorer.component";
import { FileModule } from "./components/file/file.module";

@NgModule({
	declarations: [FileExplorerComponent],
	imports: [CommonModule, FileModule, DirectoryModule, ContextMenuModule],
	exports: [FileExplorerComponent]
})
export class FileExplorerModule {}
