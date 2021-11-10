import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { DialogService } from "@web-ide/client/shared/services";
import { WorkspaceService } from "@web-ide/ide-services";
import { IndexedDbService, StoredProject } from "@web-ide/indexed-db";
import { BehaviorSubject } from "rxjs";

@Component({
	selector: "web-ide-recent-projects",
	templateUrl: "./recent-projects.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentProjectsComponent implements OnInit {
	recentProjects$ = new BehaviorSubject<StoredProject[]>([]);

	constructor(
		private readonly indexedDb: IndexedDbService,
		private readonly workspace: WorkspaceService,
		private readonly dialogService: DialogService
	) {}

	async ngOnInit(): Promise<void> {
		await this.loadRecentProjects();
	}

	private async loadRecentProjects(): Promise<void> {
		const projects = await this.indexedDb.projects.getMany();
		this.recentProjects$.next(projects);
	}

	openRecentProject(project: StoredProject): void {
		this.workspace.restoreProject(project.name);
	}

	removeRecentProject(projectName: string): void {
		this.dialogService
			.openConfirmDialog({ title: "Action.Delete", params: [projectName] })
			.subscribe(async confirmed => {
				if (confirmed) {
					await this.indexedDb.projects.delete(projectName);
					this.loadRecentProjects();
				}
			});
	}
}
