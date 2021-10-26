import { NgModule } from "@angular/core";
import { MatPaginatorModule } from "@angular/material/paginator";
import { Paginator } from "./paginator.component";

@NgModule({
	declarations: [Paginator],
	imports: [MatPaginatorModule],
	exports: [Paginator]
})
export class PaginatorModule {}
