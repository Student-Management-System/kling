import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { FirstCharacterPipeModule } from "@web-ide/client-shared";

@Component({
	selector: "web-ide-person-icon",
	templateUrl: "./person-icon.component.html",
	styleUrls: ["./person-icon.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonIconComponent {
	@Input() name!: string;
}

@NgModule({
	declarations: [PersonIconComponent],
	exports: [PersonIconComponent],
	imports: [CommonModule, FirstCharacterPipeModule]
})
export class PersonIconComponentModule {}
