import { NgModule } from "@angular/core";
import { SharedModule } from "@kling/client-shared";
import { ContextMenuModule } from "ngx-contextmenu";
import { DirectoryComponent } from "./components/directory/directory.component";
import { FileExplorerComponent } from "./components/file-explorer/file-explorer.component";
import { FileComponent } from "./components/file/file.component";

@NgModule({
	declarations: [FileExplorerComponent, FileComponent, DirectoryComponent],
	imports: [SharedModule, ContextMenuModule],
	exports: [FileExplorerComponent]
})
export class FileExplorerModule {}
