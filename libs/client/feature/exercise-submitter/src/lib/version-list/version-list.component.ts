import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Store } from "@ngrx/store";
import { StudentMgmtActions, StudentMgmtSelectors } from "@web-ide/client/data-access/state";
import { map } from "rxjs";

type MappedVersion = { author: string; date: Date };

@Component({
	selector: "web-ide-version-list",
	templateUrl: "./version-list.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class VersionListComponent {
	versions$ = this.store.select(StudentMgmtSelectors.versions).pipe(
		map(state => {
			if (state.isLoading) {
				return { isLoading: true, data: [] };
			}

			return {
				isLoading: false,
				data: state.data.map(
					(version): MappedVersion => ({
						author: version.author,
						date: new Date(version.timestamp * 1000)
					})
				)
			};
		})
	);

	constructor(private readonly store: Store) {}

	loadVersions(): void {
		this.store.dispatch(StudentMgmtActions.loadVersions());
	}
}

@NgModule({
	declarations: [VersionListComponent],
	exports: [VersionListComponent],
	imports: [CommonModule, MatProgressSpinnerModule]
})
export class VersionListModule {}
