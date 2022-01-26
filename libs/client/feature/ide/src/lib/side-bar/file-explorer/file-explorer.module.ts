import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { ContextMenuModule } from "@perfectmemory/ngx-contextmenu";
import { DirectoryModule } from "./components/directory/directory.module";
import { FileExplorerComponent } from "./components/file-explorer/file-explorer.component";
import { FileModule } from "./components/file/file.module";

@NgModule({
	declarations: [FileExplorerComponent],
	imports: [CommonModule, FileModule, DirectoryModule, ContextMenuModule, DragDropModule],
	exports: [FileExplorerComponent]
})
export class FileExplorerModule {}
