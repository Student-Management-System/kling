import { NgModule } from "@angular/core";
import { SharedModule } from "@kling/client-shared";
import { CreateDirectoryDialogComponent } from "./create-directory/create-directory.dialog";
import { CreateFileDialogComponent } from "./create-file/create-file.dialog";
import { CreateProjectDialogComponent } from "./create-project/create-project.dialog";
import { RenameDialogComponent } from "./rename/rename.dialog";
import { WorkspaceDialogs } from "./workspace-dialogs.service";

@NgModule({
	imports: [SharedModule],
	declarations: [
		CreateDirectoryDialogComponent,
		CreateFileDialogComponent,
		CreateProjectDialogComponent,
		RenameDialogComponent
	],
	providers: [WorkspaceDialogs]
})
export class IdeDialogsModule {}
