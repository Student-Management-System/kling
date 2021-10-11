import { NgModule } from "@angular/core";
import { SharedModule } from "@kling/client-shared";
import { ContextMenuModule } from "ngx-contextmenu";
import { DirectoryComponent } from "./components/directory/directory.component";
import { FileExplorerComponent } from "./components/file-explorer/file-explorer.component";
import { FileComponent } from "./components/file/file.component";
import { CreateDirectoryDialog } from "./dialogs/create-directory/create-directory.dialog";
import { CreateFileDialog } from "./dialogs/create-file/create-file.dialog";
import { RenameDialog } from "./dialogs/rename/rename.dialog";

@NgModule({
	declarations: [
		FileExplorerComponent,
		FileComponent,
		DirectoryComponent,
		CreateFileDialog,
		CreateDirectoryDialog,
		RenameDialog
	],
	imports: [SharedModule, ContextMenuModule],
	exports: [FileExplorerComponent]
})
export class FileExplorerModule {}
