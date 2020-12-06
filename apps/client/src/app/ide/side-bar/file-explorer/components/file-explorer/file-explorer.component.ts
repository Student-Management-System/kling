import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { DirectorySelectors, FileSelectors } from "../../../../../root-store";
import { FileExplorerDialogs } from "../../services/file-explorer-dialogs.facade";

@Component({
	selector: "app-file-explorer",
	templateUrl: "./file-explorer.component.html",
	styleUrls: ["./file-explorer.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileExplorerComponent implements OnInit {
	/** Top-level directories of this project. */
	directories$ = this.store.select(DirectorySelectors.selectSubdirectories("root"));
	/** Top-level files of this project. */
	files$ = this.store.select(FileSelectors.selectFilesOfDirectory("root"));
	/** The file that is currently selected by the user (displayed in the editor). */
	selectedFile$ = this.store.select(FileSelectors.selectCurrentFile);

	constructor(public workspaceDialogs: FileExplorerDialogs, private store: Store) {}

	ngOnInit(): void {}
}
