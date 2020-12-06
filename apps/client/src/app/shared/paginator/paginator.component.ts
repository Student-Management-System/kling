import { Component, OnInit, Output, EventEmitter, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { HttpResponse } from "@angular/common/http";

@Component({
	selector: "app-paginator",
	templateUrl: "./paginator.component.html",
	styleUrls: ["./paginator.component.scss"]
})
export class Paginator implements OnInit {
	/** The total number of items. (Default: 0) */
	totalCount = 0;
	/** The number of items that should be displayed on a single page. (Default: 15) */
	pageSize = 15;
	/** Zero-based index of the current page. (Default: 0) */
	currentPage = 0;

	@Output() onPageChanged = new EventEmitter<void>();
	@ViewChild(MatPaginator) private matPaginator: MatPaginator;

	constructor() {}

	ngOnInit(): void {}

	/** Move to first page, if not already there. */
	goToFirstPage(): void {
		this.matPaginator.firstPage();
	}

	/** Move to last page, if not already there. */
	goToLastPage(): void {
		this.matPaginator.lastPage();
	}

	/** Calculates the amount of records that should be skipped based on the current pagination settings. */
	getSkip(): number {
		return this.currentPage * this.pageSize;
	}

	/**
	 * Returns a tuple containing the `skip` and `take` values corresponding to the current pagination settings.
	 * @example const [skip, take] = this.paginator.getSkipAndTake();
	 */
	getSkipAndTake(): [number, number] {
		return [this.currentPage * this.pageSize, this.pageSize];
	}

	/** Sets the totalCount-property by accessing the X-TOTAL-COUNT header of the given HttpResponse.  */
	setTotalCountFromHttp<T>(response: HttpResponse<T>): void {
		this.totalCount = parseInt(response.headers.get("x-total-count"));
	}

	/** Internal method that updates the current page and informs the parent component about the change. */
	_onPageChanged(page: number): void {
		this.currentPage = page;
		this.onPageChanged.emit();
	}
}
