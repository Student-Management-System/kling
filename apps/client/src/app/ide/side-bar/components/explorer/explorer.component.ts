import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { DirectorySelectors, WorkspaceSelectors } from "@kling/client/data-access/state";
import { Store } from "@ngrx/store";
import { FileSystemAccess } from "../../../services/file-system-access.service";
import { FileExplorerDialogs } from "../../file-explorer/services/file-explorer-dialogs.facade";

@Component({
	selector: "app-explorer",
	templateUrl: "./explorer.component.html",
	styleUrls: ["./explorer.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExplorerComponent implements OnInit {
	rootDirectory$ = this.store.select(DirectorySelectors.selectDirectoryByPath(""));
	workspace$ = this.store.select(WorkspaceSelectors.selectWorkspaceState);

	constructor(
		public workspaceDialogs: FileExplorerDialogs,
		private readonly fileSystem: FileSystemAccess,
		private readonly store: Store
	) {}

	ngOnInit(): void {}

	exportToDisk(): void {
		this.fileSystem.exportAsZip();
	}
}
