import { ChangeDetectionStrategy, Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DirectorySelectors, FileSelectors } from "@kling/client/data-access/state";
import { Store } from "@ngrx/store";
import { BehaviorSubject, firstValueFrom } from "rxjs";

export type MoveToDialogData = {
	/** Specifies, whether the element that should be moved is a file or directory. */
	type: "file" | "directory";
	/** Path of the element that should be moved. */
	path: string;
	/** Name of the element that should be moved. */
	name: string;
};

@Component({
	templateUrl: "./move-to.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoveToComponent implements OnInit {
	directories$ = this.store.select(DirectorySelectors.selectAllDirectories);
	nameConflicts$ = new BehaviorSubject<string[]>([]);

	constructor(
		private readonly store: Store,
		@Inject(MAT_DIALOG_DATA) readonly data: MoveToDialogData,
		private readonly dialogRef: MatDialogRef<MoveToComponent>
	) {}

	ngOnInit(): void {
		if (!this.data) {
			throw new Error("MoveToDialogData was not specified.");
		}
	}

	async directorySelected(path: string): Promise<void> {
		const filesInTarget = await firstValueFrom(
			this.store.select(FileSelectors.selectFilesOfDirectory(path))
		);
		const compareNameWith: string[] = [];

		if (this.data.type === "file") {
			compareNameWith.push(this.data.path);
		} else {
			const filesInOrigin = await firstValueFrom(
				this.store.select(FileSelectors.selectFilesOfDirectory(this.data.path))
			);
			filesInOrigin.forEach(f => compareNameWith.push(f.name));
		}
	}
}
