import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { FileActions, FileSelectors } from "../../../../root-store";
import { File } from "../../../../root-store/file-store/file.model";
import { FileTabActions, FileTabSelectors } from "../../../../root-store/file-tabs-store";

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
