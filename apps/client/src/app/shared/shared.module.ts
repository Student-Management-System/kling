import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { MaterialModule } from "../material/material.module";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { ConfirmDialog } from "./components/dialogs/confirm-dialog/confirm-dialog.dialog";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { Paginator } from "./paginator/paginator.component";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { CategorySelectorComponent } from "./components/category-selector/category-selector.component";
import { MiddleClickDirective } from "./directives/middle-click.directive";

@NgModule({
	declarations: [
		PageNotFoundComponent,
		ConfirmDialog,
		Paginator,
		CategorySelectorComponent,
		MiddleClickDirective
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
		MiddleClickDirective
	],
	providers: []
})
export class SharedModule {}
