import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { CollaborationService } from "../../services/collaboration.service";

@Component({
	selector: "kling-collaboration",
	templateUrl: "./collaboration.component.html",
	styleUrls: ["./collaboration.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollaborationComponent implements OnInit {
	constructor(public collaborationService: CollaborationService) {}

	ngOnInit(): void {
		//this.collaborationService.joinRoom();
	}
}
