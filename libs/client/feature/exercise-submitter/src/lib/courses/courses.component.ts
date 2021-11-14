import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	NgModule,
	Output
} from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { CourseDto } from "@student-mgmt/api-client";
import { SemesterPipeModule } from "@web-ide/client-shared";

@Component({
	selector: "web-ide-courses",
	templateUrl: "./courses.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesComponent {
	@Input() courses!: CourseDto[];
	@Output() selected = new EventEmitter<CourseDto>();
}

@NgModule({
	declarations: [CoursesComponent],
	exports: [CoursesComponent],
	imports: [CommonModule, SemesterPipeModule, TranslateModule]
})
export class CoursesComponentModule {}
