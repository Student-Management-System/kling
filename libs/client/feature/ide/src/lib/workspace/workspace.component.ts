import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FileActions, FileSelectors } from "@web-ide/client/data-access/state";
import { UnsubscribeOnDestroy } from "@web-ide/client/shared/components";
import { WorkspaceLayout, WorkspaceService, WorkspaceSettingsService } from "@web-ide/ide-services";
import { IndexedDbService } from "@web-ide/indexed-db";
import { Store } from "@ngrx/store";

@Component({
	selector: "web-ide-workspace",
	templateUrl: "./workspace.component.html",
	styleUrls: ["./workspace.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceComponent extends UnsubscribeOnDestroy implements OnInit {
	selectedFile$ = this.store.select(FileSelectors.selectSelectedFilePath);
	selectedSideBarTab: string;
	layout: WorkspaceLayout;

	constructor(
		public workspaceSettings: WorkspaceSettingsService,
		private readonly workspaceService: WorkspaceService,
		private readonly indexedDb: IndexedDbService,
		private readonly route: ActivatedRoute,
		private readonly store: Store
	) {
		super();
	}

	async ngOnInit(): Promise<void> {
		this.subs.sink = this.workspaceSettings.layout$.subscribe(layout => {
			this.layout = layout;
		});
	}

	async handleEditorInit(): Promise<void> {
		const { project, file, share } = this.route.snapshot.queryParams;

		if (share) {
			// Do nothing, CollaborationService will handle loading of project
		} else if (project) {
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
}
