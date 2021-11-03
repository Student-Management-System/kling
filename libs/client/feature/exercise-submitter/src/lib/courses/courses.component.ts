import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AuthSelectors } from "@kling/client/data-access/state";
import { Store } from "@ngrx/store";

@Component({
	selector: "kling-courses",
	templateUrl: "./courses.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesComponent {
	courses$ = this.store.select(AuthSelectors.selectCourses);

	constructor(private store: Store) {}
}
