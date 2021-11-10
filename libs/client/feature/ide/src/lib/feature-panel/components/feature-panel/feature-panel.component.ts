import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { StudentMgmtSelectors } from "@web-ide/client/data-access/state";
import { UnsubscribeOnDestroy } from "@web-ide/client/shared/components";
import { DialogService } from "@web-ide/client/shared/services";
import { Store } from "@ngrx/store";

@Component({
	selector: "web-ide-feature-panel",
	templateUrl: "./feature-panel.component.html",
	styleUrls: ["./feature-panel.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturePanelComponent extends UnsubscribeOnDestroy implements OnInit {
	user$ = this.store.select(StudentMgmtSelectors.user);

	selectedTabIndex = 0;
	private tabs = ["terminal", "interactive", "collaboration", "submit"];

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private store: Store,
		readonly dialogService: DialogService
	) {
		super();
	}

	ngOnInit(): void {
		this.subs.sink = this.route.fragment.subscribe(fragment => {
			if (fragment) {
				const index = this.tabs.findIndex(f => f === fragment);

				if (index >= 0) {
					this.selectedTabIndex = index;
				}
			}
		});
	}

	selectedIndexChanged(index: number): void {
		this.router.navigate([], {
			fragment: this.tabs[index],
			queryParamsHandling: "preserve"
		});
		this.selectedTabIndex = index;
	}
}
