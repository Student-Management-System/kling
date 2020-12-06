import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class TerminalFacade {
	private _write$ = new Subject<string>();
	write$ = this._write$.asObservable();

	private _clear$ = new Subject<void>();
	clear$ = this._clear$.asObservable();

	constructor() {}

	write(text: string): void {
		this._write$.next(text);
	}

	clear(): void {
		this._clear$.next();
	}
}
