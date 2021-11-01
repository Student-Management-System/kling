import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UnsubscribeOnDestroy } from "@kling/client/shared/components";

@Component({
	selector: "kling-feature-panel",
	templateUrl: "./feature-panel.component.html",
	styleUrls: ["./feature-panel.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturePanelComponent extends UnsubscribeOnDestroy implements OnInit {
	selectedTabIndex = 0;
	private tabs = ["terminal", "interactive", "collaboration"];

	constructor(private route: ActivatedRoute, private router: Router) {
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
		this.router.navigate([], { fragment: this.tabs[index], queryParamsHandling: "preserve" });
		this.selectedTabIndex = index;
	}
}
