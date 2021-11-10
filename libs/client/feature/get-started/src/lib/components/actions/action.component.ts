import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "web-ide-action",
	templateUrl: "./action.component.html"
})
export class ActionComponent {
	@Input() title!: string;
	@Input() icon!: string;
	@Input() disabled = false;
	@Output() actionClicked = new EventEmitter<void>();
}
