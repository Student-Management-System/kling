import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class TitlebarService {
	private toggleSubject = new BehaviorSubject<boolean>(true);

	/** Emits true, if titlebar should be opened. */
	toggle$ = this.toggleSubject.asObservable();

	constructor(private router: Router) {
		router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe((event: NavigationEnd) => {
				if (event.url.match(/problems/) || event.url.match("/playground")) {
					this.hide();
				} else {
					this.show();
				}
			});
	}

	show(): void {
		this.toggleSubject.next(true);
	}

	hide(): void {
		this.toggleSubject.next(false);
	}

	toggle(): void {
		this.toggleSubject.next(!this.toggleSubject.value);
	}
}
