import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { CourseDto } from "@student-mgmt/api-client";

@Component({
	selector: "web-ide-courses",
	templateUrl: "./courses.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesComponent {
	@Input() courses!: CourseDto[];
	@Output() selected = new EventEmitter<CourseDto>();
}
