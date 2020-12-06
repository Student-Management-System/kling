import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FeaturePanelComponent } from "./feature-panel.component";

describe("FeaturePanelComponent", () => {
	let component: FeaturePanelComponent;
	let fixture: ComponentFixture<FeaturePanelComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [FeaturePanelComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FeaturePanelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
