import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { UserDto } from "@student-mgmt/api-client";
import {
	SubmissionApi,
	SubmissionResultDto,
	VersionDto
} from "@student-mgmt/exercise-submitter-api-client";
import { Observable } from "rxjs";

@Injectable()
export class ExerciseSubmitterService {
	user!: UserDto;

	constructor(private readonly store: Store, private readonly submissionApi: SubmissionApi) {}

	getPreviousVersions(
		courseId: string,
		assignmentName: string,
		groupOrUsername: string
	): Observable<VersionDto[]> {
		return this.submissionApi.listVersions(courseId, assignmentName, groupOrUsername);
	}

	createSubmission(
		courseId: string,
		assignmentName: string,
		groupOrUsername: string
	): Observable<SubmissionResultDto> {
		return this.submissionApi.submit(courseId, assignmentName, groupOrUsername);
	}
}
