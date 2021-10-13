import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SidenavService, UnsubscribeOnDestroy } from "@kling/client-shared";
import { FileActions, FileSelectors } from "@kling/client/data-access/state";
import { WorkspaceLayout, WorkspaceService, WorkspaceSettingsService } from "@kling/ide-services";
import { IndexedDbService } from "@kling/indexed-db";
import { Store } from "@ngrx/store";

@Component({
	selector: "kling-workspace",
	templateUrl: "./workspace.component.html",
	styleUrls: ["./workspace.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceComponent extends UnsubscribeOnDestroy implements OnInit, OnDestroy {
	selectedFile$ = this.store.select(FileSelectors.selectCurrentFile);
	selectedSideBarTab: string;
	layout: WorkspaceLayout;

	constructor(
		public workspaceSettings: WorkspaceSettingsService,
		private readonly workspaceService: WorkspaceService,
		private readonly indexedDb: IndexedDbService,
		private readonly sidenav: SidenavService,
		private readonly route: ActivatedRoute,
		private readonly store: Store
	) {
		super();
	}

	async ngOnInit(): Promise<void> {
		this.sidenav.forceOverlayMode(true);

		this.subs.sink = this.workspaceSettings.layout$.subscribe(layout => {
			this.layout = layout;
		});
	}

	async handleEditorInit(): Promise<void> {
		const { project, file } = this.route.snapshot.queryParams;

		if (project) {
			await this.workspaceService.restoreProject(project, false);

			if (file) {
				this.store.dispatch(FileActions.setSelectedFile({ path: file }));
			}
		} else {
			const [mostRecentProject] = await this.indexedDb.projects.getMany();

			if (mostRecentProject) {
				await this.workspaceService.restoreProject(mostRecentProject.name, false);
			} else {
				await this.workspaceService.createOrRestoreInMemoryProject("Playground");
			}
		}
	}

	onDragEnd(event: { gutterNum: number; sizes: number[] }): void {
		this.workspaceSettings.setLayout("custom", {
			explorerWidth: event.sizes[0],
			editorWidth: event.sizes[1],
			featurePanelWidth: event.sizes[2]
		});
	}

	ngOnDestroy(): void {
		super.ngOnDestroy();
		this.sidenav.forceOverlayMode(false);
	}
}
