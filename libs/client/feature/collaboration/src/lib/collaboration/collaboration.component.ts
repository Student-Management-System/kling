import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastService } from "@kling/client-shared";
import { DirectorySelectors, FileSelectors } from "@kling/client/data-access/state";
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
	shareUrl = window.location.href;

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
		const { username, share } = this.route.snapshot.queryParams;
		this.username = username;
		if (share) {
			await this.collaborationService.joinSession(username, share);
		}
	}

	async createSession(): Promise<void> {
		const [files, directories, selectedFile] = await Promise.all([
			firstValueFrom(this.store.select(FileSelectors.selectAllFiles)),
			firstValueFrom(this.store.select(DirectorySelectors.selectAllDirectories)),
			firstValueFrom(this.store.select(FileSelectors.selectCurrentFile))
		]);

		const sessionId = await this.collaborationService.createSession(this.username, {
			files,
			directories,
			selectedFile: selectedFile?.path ?? null
		});

		await this.router.navigate([], {
			queryParams: {
				share: sessionId
			},
			queryParamsHandling: "merge",
			preserveFragment: true
		});

		this.shareUrl = window.location.href;

		this.toast.success("Connected to session: " + sessionId, "Collaboration");
	}

	sendChatMessage(text: string): Promise<void> {
		return this.collaborationService.sendChatMessage(text);
	}

	disconnect(): Promise<void> {
		return this.collaborationService.disconnect();
	}

	copyToClipboard(text: string): void {
		navigator.clipboard.writeText(text);
		this.toast.info(text, "Copied to Clipboard");
	}
}
