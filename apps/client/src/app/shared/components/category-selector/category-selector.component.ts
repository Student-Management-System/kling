import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CategoryService } from "@kling/shared/data-access/api-rest-ng-client";

@Component({
	selector: "app-category-selector",
	templateUrl: "./category-selector.component.html",
	styleUrls: ["./category-selector.component.scss"]
})
export class CategorySelectorComponent implements OnInit {
	/** list of categories */
	categories: string[] = [];

	/** control for the selected category for multi-selection */
	selectedCategories: FormControl = new FormControl();

	/** control for the MatSelect filter keyword multi-selection */
	public categoryFilterCtrl: FormControl = new FormControl();

	/** list of categories filtered by search keyword */
	public filteredCategoriesSubject: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);

	@ViewChild("multiSelect", { static: true }) multiSelect: MatSelect;

	/** Subject that emits when the component has been destroyed. */
	protected _onDestroy = new Subject<void>();

	constructor(private categoryService: CategoryService) {}

	ngOnInit(): void {
		this.selectedCategories.setValue([]);

		// load the initial category list
		this.categoryService.findCategories(undefined, undefined).subscribe(result => {
			this.categories = result;
			this.filteredCategoriesSubject.next(this.categories);
		});

		// listen for search field value changes
		this.categoryFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(value => {
			this.filteredCategoriesSubject.next(
				this.categories.filter(c =>
					c.toLowerCase().includes(((value as string) ?? "").toLowerCase())
				)
			);
		});
	}

	protected ngOnDestroy(): void {
		this._onDestroy.next();
		this._onDestroy.complete();
	}

	public setSelectedCategories(categories: string[]): void {
		this.categories = categories;
		this.selectedCategories.setValue(categories);
	}
}
