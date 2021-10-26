import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class SidenavService {
	private _toggle$ = new BehaviorSubject<boolean>(false);
	private _forceOverlayMode$ = new BehaviorSubject<boolean>(false);

	/** Emits true, if sidenav should be opened. */
	toggle$ = this._toggle$.asObservable();
	forceOverlayMode$ = this._forceOverlayMode$.asObservable();

	constructor() {}

	open(): void {
		this._toggle$.next(true);
	}

	close(): void {
		this._toggle$.next(false);
	}

	toggle(): void {
		this._toggle$.next(!this._toggle$.value);
	}

	/**
	 * Emits the given boolean value via `forceOverlayMode$`.
	 * If set to `true`, the sidebar will always be in overlay mode
	 * instead of pushing content to the side when opened.
	 */
	forceOverlayMode(bool: boolean): void {
		this._forceOverlayMode$.next(bool);
	}
}
