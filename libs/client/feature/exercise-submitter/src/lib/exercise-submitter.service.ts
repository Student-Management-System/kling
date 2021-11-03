import { Injectable } from "@angular/core";
import { AssignmentDto, CourseDto, UserDto } from "@student-mgmt/api-client";
import { Observable, of } from "rxjs";

@Injectable()
export class ExerciseSubmitterService {
	user$: Observable<UserDto | null>;
	courses$: Observable<CourseDto[]>;
	assignments$: Observable<AssignmentDto[]>;

	constructor() {
		const user: UserDto = {
			displayName: "Max Mustermann",
			role: "USER",
			username: "mmustermann",
			id: "1-2-3"
		};

		const COURSE_JAVA_1920: CourseDto = {
			id: "java-wise1920",
			shortname: "java",
			semester: "wise1920",
			title: "Programmierpraktikum I: Java",
			isClosed: false,
			links: [
				{
					name: "Example URL",
					url: "http://example-url.com"
				}
			]
		};

		const COURSE_JAVA_2020: CourseDto = {
			id: "java-sose2020",
			shortname: "java",
			semester: "sose2020",
			title: "Programmierpraktikum I: Java",
			isClosed: false,
			links: [
				{
					name: "Example URL",
					url: "http://example-url.com"
				}
			]
		};

		const courses: CourseDto[] = [COURSE_JAVA_1920, COURSE_JAVA_2020];

		this.user$ = of(user);
		this.courses$ = of(courses);
		this.assignments$ = of();
	}
}
