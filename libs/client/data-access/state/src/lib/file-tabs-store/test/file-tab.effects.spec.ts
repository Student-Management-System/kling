import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Observable } from "rxjs";

import { FileTabEffects } from "../file-tab.effects";

describe("FileTabEffects", () => {
	let actions$: Observable<any>;
	let effects: FileTabEffects;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [FileTabEffects, provideMockActions(() => actions$)]
		});

		effects = TestBed.inject(FileTabEffects);
	});

	it("should be created", () => {
		expect(effects).toBeTruthy();
	});
});
