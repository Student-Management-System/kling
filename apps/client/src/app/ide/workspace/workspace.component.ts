import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
	FileActions,
	FileSelectors,
	FileTabActions,
	WorkspaceActions
} from "@kling/client/data-access/state";
import { IndexedDbService } from "@kling/indexed-db";
import { Store } from "@ngrx/store";
import { UnsubscribeOnDestroy } from "../../shared/components/unsubscribe-on-destroy.component";
import { SidenavService } from "../../shared/services/sidenav.service";
import { CodeEditorComponent } from "../editor/components/code-editor/code-editor.component";
import { WorkspaceLayout, WorkspaceSettingsService } from "../services/workspace-settings.service";
import { WorkspaceService } from "../services/workspace.service";

@Component({
	selector: "app-workspace",
	templateUrl: "./workspace.component.html",
	styleUrls: ["./workspace.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceComponent extends UnsubscribeOnDestroy implements OnInit, OnDestroy {
	@ViewChild("editor", { static: true }) private codeEditor: CodeEditorComponent;
	selectedFile$ = this.store.select(FileSelectors.selectCurrentFile);
	selectedSideBarTab: string;
	layout: WorkspaceLayout;

	constructor(
		public workspaceSettings: WorkspaceSettingsService,
		private readonly workspaceService: WorkspaceService,
		private indexedDb: IndexedDbService,
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
			setTimeout(() => this.codeEditor.resize(), 0); // Hack: Delay resize to prevent race condition
		});

		const { project } = this.route.snapshot.queryParams;

		if (!project) {
			await this.restoreMostRecentProject();
		}
	}

	private async restoreMostRecentProject() {
		const mostRecentProject = await this.indexedDb.projects.getMany();

		if (mostRecentProject.length > 0) {
			await this.workspaceService.restoreProject(mostRecentProject[0].name, false);
		} else {
			this.store.dispatch(
				WorkspaceActions.loadProject({
					projectName: "Playground",
					files: [],
					directories: []
				})
			);
		}
	}

	handleEditorInit(): void {
		const { project } = this.route.snapshot.queryParams;

		if (project) {
			this.workspaceService.restoreProject(project);
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
