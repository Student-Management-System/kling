import { NgModule } from "@angular/core";
import { ContextMenuModule } from "ngx-contextmenu";
import { SharedModule } from "../../../shared/shared.module";
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
	exports: [FileExplorerComponent],
	providers: []
})
export class FileExplorerModule {}
