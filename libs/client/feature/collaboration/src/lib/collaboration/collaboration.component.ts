import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastService } from "@kling/client-shared";
import { DirectorySelectors, FileActions, FileSelectors } from "@kling/client/data-access/state";
import { Store } from "@ngrx/store";
import { firstValueFrom } from "rxjs";
import { CollaborationService } from "../collaboration.service";

@Component({
	selector: "kling-collaboration",
	templateUrl: "./collaboration.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollaborationComponent implements OnInit {
	chatMessageInput = "";
	shareUrl!: string | null;

	readonly activeSessionId$ = this.collaborationService.activeSessionId$;
	readonly collaborators$ = this.collaborationService.collaborators$;
	readonly messages$ = this.collaborationService.messages$;

	private username!: string;

	constructor(
		readonly location: Location,
		private readonly collaborationService: CollaborationService,
		private readonly store: Store,
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly toast: ToastService
	) {}

	async ngOnInit(): Promise<void> {
		const { username, share, file } = this.route.snapshot.queryParams;
		this.username = username;

		if (share) {
			await this.joinSession(share);
			this.store.dispatch(FileActions.setSelectedFile({ path: file }));
		}
	}

	async createSession(): Promise<void> {
		const [files, directories, selectedFile] = await Promise.all([
			firstValueFrom(this.store.select(FileSelectors.selectAllFiles)),
			firstValueFrom(this.store.select(DirectorySelectors.selectAllDirectories)),
			firstValueFrom(this.store.select(FileSelectors.selectSelectedFilePath))
		]);

		const sessionId = await this.collaborationService.createSession(this.username, {
			files,
			directories,
			selectedFile
		});

		await this.router.navigate([], {
			queryParams: {
				share: sessionId
			},
			queryParamsHandling: "merge",
			preserveFragment: true
		});

		this.shareUrl = this.generateShareUrl(sessionId);
		this.toast.success("Connected to session: " + sessionId, "Collaboration");
	}

	async joinSession(id: string): Promise<void> {
		this.shareUrl = this.generateShareUrl(id);
		await this.collaborationService.joinSession(this.username, id);
	}

	private generateShareUrl(id: string): string {
		return `${window.location.origin}/ide?share=${id}`;
	}

	sendChatMessage(text: string): Promise<void> {
		return this.collaborationService.sendChatMessage(text);
	}

	async disconnect(): Promise<void> {
		await this.collaborationService.disconnect();
		this.router.navigate([], {
			queryParams: {
				share: undefined
			},
			queryParamsHandling: "merge",
			preserveFragment: true
		});
	}

	copyToClipboard(text: string): void {
		navigator.clipboard.writeText(text);
		this.toast.info(text, "Copied to Clipboard");
	}
}
