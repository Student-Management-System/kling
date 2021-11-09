import { Injectable } from "@angular/core";
import { StudentMgmtSelectors } from "@kling/client/data-access/state";
import { Store } from "@ngrx/store";
import {
	SubmissionApi,
	SubmissionResultDto,
	VersionDto
} from "@student-mgmt/exercise-submitter-api-client";
import { Observable } from "rxjs";

@Injectable()
export class ExerciseSubmitterService {
	/**
	 * Determines, whether the Exercise Submitter has been opened before.
	 * In that case, it is not necessary to refetch all student data from the student management system.
	 */
	isInitialized = false;

	constructor(private readonly store: Store, private readonly submissionApi: SubmissionApi) {
		this.store.select(StudentMgmtSelectors.user).subscribe(user => {
			if (!user) {
				// Obviously, student data must be reloaded when another user logs in
				this.isInitialized = false;
			}
		});
	}

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
