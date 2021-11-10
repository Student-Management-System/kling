import { ChangeDetectionStrategy, Component } from "@angular/core";
import {
	FileActions,
	FileSelectors,
	FileTabActions,
	FileTabSelectors
} from "@web-ide/client/data-access/state";
import { Store } from "@ngrx/store";

@Component({
	selector: "web-ide-file-tabs",
	templateUrl: "./file-tabs.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileTabsComponent {
	selectedFilePath$ = this.store.select(FileSelectors.selectSelectedFilePath);
	tabs$ = this.store.select(FileTabSelectors.getFileTabs);

	constructor(private store: Store) {}

	selectTab(selectedPath: string, currentPath: string): void {
		if (selectedPath !== currentPath) {
			this.store.dispatch(FileActions.setSelectedFile({ path: selectedPath }));
		}
	}

	closeTab(selectedPath: string): void {
		this.store.dispatch(FileTabActions.removeFileTab({ path: selectedPath }));
	}
}
