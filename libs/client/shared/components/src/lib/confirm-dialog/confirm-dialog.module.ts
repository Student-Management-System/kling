import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { TranslateModule } from "@ngx-translate/core";
import { ConfirmDialog } from "./confirm-dialog.dialog";

@NgModule({
	declarations: [ConfirmDialog],
	imports: [CommonModule, TranslateModule, MatCardModule],
	exports: [ConfirmDialog]
})
export class ConfirmDialogModule {}
