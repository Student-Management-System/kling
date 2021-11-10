import { Injectable } from "@angular/core";
import { StudentMgmtActions, StudentMgmtSelectors } from "@web-ide/client/data-access/state";
import { Store } from "@ngrx/store";
import {
	FileDto,
	SubmissionApi,
	SubmissionResultDto,
	VersionDto
} from "@student-mgmt/exercise-submitter-api-client";
import { BehaviorSubject, firstValueFrom, Observable } from "rxjs";
import { File } from "@web-ide/programming";

@Injectable()
export class ExerciseSubmitterService {
	submissionResult$ = this.store.select(StudentMgmtSelectors.submissionResult);
	isSubmitting$ = new BehaviorSubject<boolean>(false);

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

	async createSubmission(
		courseId: string,
		assignmentName: string,
		groupOrUsername: string,
		files: File[]
	): Promise<void> {
		const encodedFiles: FileDto[] = files.map(f => ({
			path: f.path,
			content: this.toBase64(f.content)
		}));

		this.isSubmitting$.next(true);
		let submissionResult: SubmissionResultDto | undefined = undefined;

		try {
			submissionResult = await firstValueFrom(
				this.submissionApi.submit(courseId, assignmentName, groupOrUsername, encodedFiles)
			);

			console.log(submissionResult);
		} catch (error) {
			console.error(error);
		} finally {
			this.store.dispatch(StudentMgmtActions.setSubmissionResult({ submissionResult }));
			this.isSubmitting$.next(false);
		}
	}

	toBase64(str: string): string {
		return btoa(unescape(encodeURIComponent(str)));
	}

	fromBase64(encodedStr: string): string {
		return decodeURIComponent(escape(window.atob(encodedStr)));
	}
}
