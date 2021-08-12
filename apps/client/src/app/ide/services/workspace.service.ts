import { Injectable } from "@angular/core";
import { File } from "@kling/client/data-access/state";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class WorkspaceService {
	private _init$ = new Subject<void>();
	/** Emits when the workspace is initialized. */
	init$ = this._init$.asObservable();

	private _fileAdded$ = new BehaviorSubject<File>(undefined);
	/** Emits the added file. */
	fileAdded$ = this._fileAdded$.asObservable();

	private _fileRemoved$ = new BehaviorSubject<string>(undefined);
	/** Emits the `id` of the removed file. */
	fileRemoved$ = this._fileRemoved$.asObservable();

	/** Emits when the editor should be focused programmatically, i.e. after adding a new file */
	readonly focusEditor$ = new Subject<void>();

	constructor(private readonly store: Store) {}

	initWorkspace(): void {
		this._init$.next();
	}

	emitFileAdded(file: File): void {
		this._fileAdded$.next(file);
	}

	emitFileRemoved(path: string): void {
		this._fileRemoved$.next(path);
	}

	/** Brings browser focus to the editor. */
	focusEditor(): void {
		this.focusEditor$.next();
	}
}
