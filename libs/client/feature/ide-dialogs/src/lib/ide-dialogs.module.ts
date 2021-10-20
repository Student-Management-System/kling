import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { TranslateModule } from "@ngx-translate/core";
import { CreateDirectoryDialogComponent } from "./create-directory/create-directory.dialog";
import { CreateFileDialogComponent } from "./create-file/create-file.dialog";
import { CreateProjectDialogComponent } from "./create-project/create-project.dialog";
import { RenameDialogComponent } from "./rename/rename.dialog";
import { WorkspaceDialogs } from "./workspace-dialogs.service";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatCardModule,
		TranslateModule
	],
	declarations: [
		CreateDirectoryDialogComponent,
		CreateFileDialogComponent,
		CreateProjectDialogComponent,
		RenameDialogComponent
	],
	providers: [WorkspaceDialogs]
})
export class IdeDialogsModule {}
