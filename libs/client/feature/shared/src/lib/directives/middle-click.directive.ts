import { Directive, Output, EventEmitter, HostListener } from "@angular/core";

@Directive({ selector: "[middleclick]" })
export class MiddleClickDirective {
	@Output("middleclick") middleclick = new EventEmitter();

	constructor() {}

	@HostListener("mouseup", ["$event"])
	middleclickEvent(event: any): void {
		if (event.which === 2) {
			this.middleclick.emit(event);
		}
	}
}
