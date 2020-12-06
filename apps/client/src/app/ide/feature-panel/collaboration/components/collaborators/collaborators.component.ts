import { Component, OnInit, ChangeDetectionStrategy, Input } from "@angular/core";
import { CollaborationService } from "../../services/collaboration.service";

@Component({
	selector: "app-collaborators",
	templateUrl: "./collaborators.component.html",
	styleUrls: ["./collaborators.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollaboratorsComponent implements OnInit {
	@Input() participants: string[];

	constructor(public collaborationService: CollaborationService) {}

	ngOnInit(): void {}
}
