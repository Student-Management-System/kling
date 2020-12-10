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

	selectTab(selectedTab: File, currentTab: File): void {
		if (selectedTab.path !== currentTab.path) {
			this.store.dispatch(FileActions.setSelectedFile({ fileId: selectedTab.path }));
		}
	}

	closeTab(file: File): void {
		this.store.dispatch(FileTabActions.removeFileTab({ filePath: file.path }));
	}
}
