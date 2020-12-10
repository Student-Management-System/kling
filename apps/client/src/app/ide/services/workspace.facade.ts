import { Injectable } from "@angular/core";
import { File } from "@kling/client/data-access/state";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class WorkspaceFacade {
	private _init$ = new Subject<void>();
	/** Emits when the workspace is initialized. */
	init$ = this._init$.asObservable();

	private _fileAdded$ = new BehaviorSubject<File>(undefined);
	/** Emits the added file. */
	fileAdded$ = this._fileAdded$.asObservable();

	private _fileRemoved$ = new BehaviorSubject<string>(undefined);
	/** Emits the `id` of the removed file. */
	fileRemoved$ = this._fileRemoved$.asObservable();

	initWorkspace(): void {
		this._init$.next();
	}

	emitFileAdded(file: File): void {
		this._fileAdded$.next(file);
	}

	emitFileRemoved(fileId: string): void {
		this._fileRemoved$.next(fileId);
	}
}
