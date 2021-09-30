import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import {
	FileActions,
	FileSelectors,
	FileTabActions,
	FileTabSelectors
} from "@kling/client/data-access/state";
import { Store } from "@ngrx/store";
import { File } from "@kling/programming";

@Component({
	selector: "app-file-tabs",
	templateUrl: "./file-tabs.component.html",
	styleUrls: ["./file-tabs.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileTabsComponent implements OnInit {
	selectedFile$ = this.store.select(FileSelectors.selectCurrentFile);
	tabs$ = this.store.select(FileTabSelectors.getFileTabs);

	constructor(private store: Store) {}

	ngOnInit(): void {}

	selectTab(selectedTab: File, currentTab: File): void {
		if (selectedTab.path !== currentTab.path) {
			this.store.dispatch(FileActions.setSelectedFile({ file: selectedTab }));
		}
	}

	closeTab(selectedTab: File): void {
		this.store.dispatch(FileTabActions.removeFileTab({ filePath: selectedTab.path }));
	}
}
