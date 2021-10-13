import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Observable } from "rxjs";
import { ChatMessage, CollaborationService } from "../../services/collaboration.service";

@Component({
	selector: "kling-chat",
	templateUrl: "./chat.component.html",
	styleUrls: ["./chat.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit {
	messageContent = "";

	messages$: Observable<ChatMessage[]>;

	constructor(private collaborationService: CollaborationService) {}

	ngOnInit(): void {
		this.messages$ = this.collaborationService.chatMessages$;
	}

	send(): void {
		if (this.messageContent?.length > 0) {
			this.collaborationService.sendChatMessage(this.messageContent);

			this.messageContent = "";
		}
	}
}
