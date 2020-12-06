import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateFileDialog } from "./create-file.dialog";

describe("CreateFileDialog", () => {
	let component: CreateFileDialog;
	let fixture: ComponentFixture<CreateFileDialog>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CreateFileDialog]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CreateFileDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
