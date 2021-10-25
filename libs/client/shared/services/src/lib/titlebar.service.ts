import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class TitlebarService {
	private toggleSubject = new BehaviorSubject<boolean>(false);

	/** Emits true, if titlebar should be opened. */
	toggle$ = this.toggleSubject.asObservable();

	constructor(private router: Router) {
		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(event => {
				if (!(event as NavigationEnd).url.match("/ide")) {
					this.show();
				} else {
					this.hide();
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
