import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import {
	File,
	FileActions,
	FileSelectors,
	FileTabActions,
	FileTabSelectors
} from "@kling/client/data-access/state";
import { Store } from "@ngrx/store";

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

	selectTab(selectedTab: string, currentTab: File): void {
		if (selectedTab !== currentTab.path) {
			this.store.dispatch(FileActions.setSelectedFile({ path: selectedTab }));
		}
	}

	closeTab(path: string): void {
		this.store.dispatch(FileTabActions.removeFileTab({ filePath: path }));
	}
}
