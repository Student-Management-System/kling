import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Action } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import { cold, hot } from "jest-marbles";
import { Observable } from "rxjs";
import { FileActions } from "..";
import { WorkspaceFacade } from "../../../ide/services/workspace.facade";
import { FileEffects } from "../file.effects";
import { createFile } from "../file.model";

// https://dev.to/jdpearce/how-to-test-five-common-ngrx-effect-patterns-26cb

Error.stackTraceLimit = 1;

const mock_WorkspaceFacade = () => ({
	emitFileAdded: jest.fn(),
	emitFileRemoved: jest.fn()
});

describe("FileEffects", () => {
	let actions$: Observable<Action>;
	let fileEffects: FileEffects;
	let workspace: WorkspaceFacade;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				FileEffects,
				{ provide: WorkspaceFacade, useFactory: mock_WorkspaceFacade },
				provideMockActions(() => actions$),
				provideMockStore()
			]
		});

		fileEffects = TestBed.inject(FileEffects);
		workspace = TestBed.inject(WorkspaceFacade);
	});

	describe("fileAdded$", () => {
		it("Calls emitFileAdded of WorkspaceFacade", () => {
			const file = createFile("a-file.ts", "root");
			const action = FileActions.addFile({ file });

			actions$ = hot("a", { a: action });
			const expected$ = cold("a", { a: action });

			expect(fileEffects.fileAdded$).toBeObservable(expected$);
			expect(workspace.emitFileAdded).toHaveBeenCalledWith(file);
		});
	});

	describe("fileRemoved$", () => {
		it("Calls emitFileRemoved of WorkspaceFacade", () => {
			const fileId = "root/removed-file.ts";
			const action = FileActions.deleteFile({ fileId });

			actions$ = hot("a", { a: action });
			const expected$ = cold("a", { a: action });

			expect(fileEffects.fileRemoved$).toBeObservable(expected$);
			expect(workspace.emitFileRemoved).toHaveBeenCalledWith(fileId);
		});
	});
});
