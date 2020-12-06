import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateDirectoryDialog } from "./create-directory.dialog";

describe("CreateDirectoryDialog", () => {
	let component: CreateDirectoryDialog;
	let fixture: ComponentFixture<CreateDirectoryDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CreateDirectoryDialog]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CreateDirectoryDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
