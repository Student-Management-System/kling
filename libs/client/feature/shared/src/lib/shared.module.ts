import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { MaterialModule } from "./material/material.module";
import { ConfirmDialog } from "./components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { Paginator } from "./paginator/paginator.component";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { CategorySelectorComponent } from "./components/category-selector/category-selector.component";
import { MiddleClickDirective } from "./directives/middle-click.directive";
import { IconComponent } from "./components/icon.component";
import { FileIconComponent } from "./components/file-icon/file-icon.component";
import { DropzoneDirective } from "./directives/dropzone.directive";
import { ProgrammingLanguagePipe } from "./pipes/programming-language.pipe";

@NgModule({
	declarations: [
		ConfirmDialog,
		Paginator,
		CategorySelectorComponent,
		MiddleClickDirective,
		DropzoneDirective,
		IconComponent,
		FileIconComponent,
		ProgrammingLanguagePipe
	],
	imports: [
		CommonModule,
		MaterialModule,
		TranslateModule,
		NgxMatSelectSearchModule,
		FormsModule,
		ReactiveFormsModule
	],
	exports: [
		CommonModule,
		MaterialModule,
		TranslateModule,
		FormsModule,
		ReactiveFormsModule,
		MatNativeDateModule,
		Paginator,
		CategorySelectorComponent,
		MiddleClickDirective,
		DropzoneDirective,
		IconComponent,
		FileIconComponent,
		ProgrammingLanguagePipe
	],
	providers: []
})
export class SharedModule {}