import { Directive, EventEmitter, HostListener, Output } from "@angular/core";

@Directive({ selector: "[middleclick]" })
export class MiddleClickDirective {
	@Output() middleclick = new EventEmitter();

	constructor() {}

	@HostListener("mouseup", ["$event"])
	middleclickEvent(event: any): void {
		if (event.which === 2) {
			this.middleclick.emit(event);
		}
	}
}
