import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatChipsModule } from "@angular/material/chips";
import { IconModule, PaginatorModule } from "@kling/client/shared/components";
import { TranslateModule } from "@ngx-translate/core";
import { ProblemListRoutingModule } from "./problem-list-routing.module";
import { ProblemListComponent } from "./problem-list/problem-list.component";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";

@NgModule({
	declarations: [ProblemListComponent],
	imports: [
		CommonModule,
		ProblemListRoutingModule,
		TranslateModule,
		MatCardModule,
		MatOptionModule,
		MatSelectModule,
		MatFormFieldModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		FormsModule,
		MatTableModule,
		IconModule,
		MatChipsModule,
		PaginatorModule
	]
})
export class ProblemListModule {}
