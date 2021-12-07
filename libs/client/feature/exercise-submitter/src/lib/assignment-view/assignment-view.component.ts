import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	NgModule,
	OnInit,
	Output
} from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTabChangeEvent, MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { AssignmentDto, GroupDto, UserDto } from "@student-mgmt/api-client";
import { SubmissionResultDto } from "@student-mgmt/exercise-submitter-api-client";
import {
	FileActions,
	FileSelectors,
	StudentMgmtActions,
	StudentMgmtSelectors,
	WorkspaceActions,
	WorkspaceSelectors
} from "@web-ide/client/data-access/state";
import { DialogService, ToastService } from "@web-ide/client/shared/services";
import { WorkspaceDialogs } from "@web-ide/ide-dialogs";
import { DifferenceDialogData } from "libs/client/feature/ide-dialogs/src/lib/difference/difference.component";
import { firstValueFrom, map } from "rxjs";
import { SubmitInfo } from "../exercise-submitter.component";
import { ExerciseSubmitterService } from "../exercise-submitter.service";
import { AssignmentDetailComponentModule } from "./assignment-detail/assignment-detail.component";
import { SubmissionResultModule } from "./submission-result/submission-result.component";
import { VersionListModule, VersionWithDate } from "./version-list/version-list.component";

@Component({
	selector: "web-ide-assignment-view",
	templateUrl: "./assignment-view.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentViewComponent implements OnInit {
	@Input() courseId!: string;
	@Input() assignment!: AssignmentDto;
	@Input() user!: UserDto;
	@Input() group?: GroupDto | null;
	@Input() result?: SubmissionResultDto;
	@Output() submitSolution = new EventEmitter<SubmitInfo>();

	isSubmitting$ = this.exerciseSubmitter.isSubmitting$;
	versions$ = this.store.select(StudentMgmtSelectors.versions).pipe(
		map(state => {
			if (state.isLoading) {
				return { isLoading: true, data: [] };
			}

			return {
				isLoading: false,
				data: state.data.map(
					(version): VersionWithDate => ({
						...version,
						date: new Date(version.timestamp * 1000)
					})
				)
			};
		})
	);

	selectedTabIndex = 0;
	assignmentState = AssignmentDto.StateEnum;

	constructor(
		private readonly exerciseSubmitter: ExerciseSubmitterService,
		private readonly store: Store,
		private readonly dialog: DialogService,
		private readonly workspaceDialogs: WorkspaceDialogs,
		private readonly toast: ToastService,
		private readonly translate: TranslateService,
		private readonly route: ActivatedRoute,
		private readonly router: Router
	) {}

	ngOnInit(): void {
		const showVersions = this.route.snapshot.queryParams.showVersions;

		if (showVersions) {
			this.selectedTabIndex = 1;
		}
	}

	submit(): void {
		this.submitSolution.next({
			courseId: this.courseId,
			assignmentName: this.assignment.name,
			groupOrUsername: this.getGroupOrUsername()
		});
	}

	loadVersions(): void {
		this.store.dispatch(StudentMgmtActions.loadVersions());
	}

	async replay(version: VersionWithDate): Promise<void> {
		const title = this.translate.instant("Action.Custom.ExerciseSubmitter.Replay");
		const message = this.translate.instant("Text.ExerciseSubmitter.ConfirmReplay");
		const date = version.date.toLocaleString();

		const confirmed = await firstValueFrom(
			this.dialog.openConfirmDialog({
				title,
				message,
				params: [`${date} (${version.author})`]
			})
		);

		if (confirmed) {
			await this._replay(title, date, version);
		}
	}

	private async _replay(title: string, date: string, version: VersionWithDate): Promise<void> {
		this.toast.info(`${title}: ${date}`);

		const { files, directories } = await this.exerciseSubmitter.getVersion(
			this.courseId,
			this.assignment.name,
			this.getGroupOrUsername(),
			version.timestamp
		);

		const currentFile = await firstValueFrom(
			this.store.select(FileSelectors.selectSelectedFilePath)
		);

		const entryPoint = await firstValueFrom(
			this.store.select(WorkspaceSelectors.selectEntryPoint)
		);

		this.store.dispatch(WorkspaceActions.overwriteProject({ files, directories }));

		if (files.find(f => f.path === currentFile)) {
			this.store.dispatch(FileActions.setSelectedFile({ path: currentFile }));
		}

		if (entryPoint && files.find(f => f.path === entryPoint)) {
			this.store.dispatch(WorkspaceActions.setEntryPoint({ path: entryPoint }));
		}
	}

	async compare(version: VersionWithDate): Promise<void> {
		const { files: original } = await this.exerciseSubmitter.getVersion(
			this.courseId,
			this.assignment.name,
			this.getGroupOrUsername(),
			version.timestamp
		);

		const modified = await firstValueFrom(this.store.select(FileSelectors.selectAllFiles));
		const selectedFile = await firstValueFrom(
			this.store.select(FileSelectors.selectSelectedFilePath)
		);

		const data: DifferenceDialogData = {
			date: version.date,
			original,
			modified,
			selectedFile
		};

		this.workspaceDialogs.openDiffDialog(data).subscribe(replayRequested => {
			if (replayRequested) {
				this.replay(version);
			}
		});
	}

	onTabChange(event: MatTabChangeEvent): void {
		this.selectedTabIndex = event.index;
		let showVersions: boolean | undefined = undefined;

		if (event.index === 1) {
			this.loadVersions();
			showVersions = true;
		}

		this.router.navigate([], {
			preserveFragment: true,
			queryParamsHandling: "merge",
			queryParams: {
				showVersions
			}
		});
	}

	private getGroupOrUsername(): string {
		return this.group?.name ?? this.user.username;
	}
}

@NgModule({
	declarations: [AssignmentViewComponent],
	exports: [AssignmentViewComponent],
	imports: [
		CommonModule,
		TranslateModule,
		MatProgressSpinnerModule,
		MatTabsModule,
		AssignmentDetailComponentModule,
		SubmissionResultModule,
		VersionListModule
	]
})
export class AssignmentViewComponentModule {}
