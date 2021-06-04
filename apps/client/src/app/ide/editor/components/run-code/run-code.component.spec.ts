import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { RunCodeComponent } from "./run-code.component";

describe("RunCodeComponent", () => {
	let component: RunCodeComponent;
	let fixture: ComponentFixture<RunCodeComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [RunCodeComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RunCodeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
