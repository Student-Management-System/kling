/**
 * Student-Management-System-API
 * The Student-Management-System-API. <a href=\'http://localhost:3000/api-json\'>JSON</a>
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional } from "@angular/core";
import {
	HttpClient,
	HttpHeaders,
	HttpParams,
	HttpResponse,
	HttpEvent,
	HttpParameterCodec
} from "@angular/common/http";
import { CustomHttpParameterCodec } from "../encoder";
import { Observable } from "rxjs";

import { SubmissionCreateDto } from "../model/models";
import { SubmissionDto } from "../model/models";

import { BASE_PATH, COLLECTION_FORMATS } from "../variables";
import { Configuration } from "../configuration";

@Injectable({
	providedIn: "root"
})
export class SubmissionService {
	protected basePath = "http://localhost";
	public defaultHeaders = new HttpHeaders();
	public configuration = new Configuration();
	public encoder: HttpParameterCodec;

	constructor(
		protected httpClient: HttpClient,
		@Optional() @Inject(BASE_PATH) basePath: string,
		@Optional() configuration: Configuration
	) {
		if (configuration) {
			this.configuration = configuration;
		}
		if (typeof this.configuration.basePath !== "string") {
			if (typeof basePath !== "string") {
				basePath = this.basePath;
			}
			this.configuration.basePath = basePath;
		}
		this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
	}

	private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
		if (typeof value === "object" && value instanceof Date === false) {
			httpParams = this.addToHttpParamsRecursive(httpParams, value);
		} else {
			httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
		}
		return httpParams;
	}

	private addToHttpParamsRecursive(
		httpParams: HttpParams,
		value?: any,
		key?: string
	): HttpParams {
		if (value == null) {
			return httpParams;
		}

		if (typeof value === "object") {
			if (Array.isArray(value)) {
				(value as any[]).forEach(
					elem => (httpParams = this.addToHttpParamsRecursive(httpParams, elem, key))
				);
			} else if (value instanceof Date) {
				if (key != null) {
					httpParams = httpParams.append(
						key,
						(value as Date).toISOString().substr(0, 10)
					);
				} else {
					throw Error("key may not be null if value is Date");
				}
			} else {
				Object.keys(value).forEach(
					k =>
						(httpParams = this.addToHttpParamsRecursive(
							httpParams,
							value[k],
							key != null ? `${key}.${k}` : k
						))
				);
			}
		} else if (key != null) {
			httpParams = httpParams.append(key, value);
		} else {
			throw Error("key may not be null if value is not object or array");
		}
		return httpParams;
	}

	/**
	 * Add submission
	 * Adds a submission for the specified assignment.
	 * @param courseId
	 * @param assignmentId
	 * @param submissionCreateDto
	 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
	 * @param reportProgress flag to report request and response progress.
	 */
	public add(
		courseId: string,
		assignmentId: string,
		submissionCreateDto: SubmissionCreateDto,
		observe?: "body",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<SubmissionDto>;
	public add(
		courseId: string,
		assignmentId: string,
		submissionCreateDto: SubmissionCreateDto,
		observe?: "response",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpResponse<SubmissionDto>>;
	public add(
		courseId: string,
		assignmentId: string,
		submissionCreateDto: SubmissionCreateDto,
		observe?: "events",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpEvent<SubmissionDto>>;
	public add(
		courseId: string,
		assignmentId: string,
		submissionCreateDto: SubmissionCreateDto,
		observe: any = "body",
		reportProgress: boolean = false,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<any> {
		if (courseId === null || courseId === undefined) {
			throw new Error("Required parameter courseId was null or undefined when calling add.");
		}
		if (assignmentId === null || assignmentId === undefined) {
			throw new Error(
				"Required parameter assignmentId was null or undefined when calling add."
			);
		}
		if (submissionCreateDto === null || submissionCreateDto === undefined) {
			throw new Error(
				"Required parameter submissionCreateDto was null or undefined when calling add."
			);
		}

		let headers = this.defaultHeaders;

		let credential: string | undefined;
		// authentication (bearer) required
		credential = this.configuration.lookupCredential("bearer");
		if (credential) {
			headers = headers.set("Authorization", "Bearer " + credential);
		}

		let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
		if (httpHeaderAcceptSelected === undefined) {
			// to determine the Accept header
			const httpHeaderAccepts: string[] = ["application/json"];
			httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
		}
		if (httpHeaderAcceptSelected !== undefined) {
			headers = headers.set("Accept", httpHeaderAcceptSelected);
		}

		// to determine the Content-Type header
		const consumes: string[] = ["application/json"];
		const httpContentTypeSelected:
			| string
			| undefined = this.configuration.selectHeaderContentType(consumes);
		if (httpContentTypeSelected !== undefined) {
			headers = headers.set("Content-Type", httpContentTypeSelected);
		}

		let responseType_: "text" | "json" = "json";
		if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith("text")) {
			responseType_ = "text";
		}

		return this.httpClient.post<SubmissionDto>(
			`${this.configuration.basePath}/courses/${encodeURIComponent(
				String(courseId)
			)}/submissions/assignments/${encodeURIComponent(String(assignmentId))}`,
			submissionCreateDto,
			{
				responseType: <any>responseType_,
				withCredentials: this.configuration.withCredentials,
				headers: headers,
				observe: observe,
				reportProgress: reportProgress
			}
		);
	}

	/**
	 * Get all submissions.
	 * Retrieves all submissions that match the given filter.
	 * @param courseId
	 * @param skip [Pagination] The amount of elements that should be skipped.
	 * @param take [Pagination] The amount of elements that should be included in the response.
	 * @param userId Filters by userId.
	 * @param assignmentId Filters by assignmentId.
	 * @param groupId Filters by groupId.
	 * @param displayName Filters by user\&#39;s displayName. Matched with ILIKE %displayName%.
	 * @param groupName Filters by group name. Matched with ILIKE %groupName%.
	 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
	 * @param reportProgress flag to report request and response progress.
	 */
	public getAllSubmissions(
		courseId: string,
		skip?: number,
		take?: number,
		userId?: string,
		assignmentId?: string,
		groupId?: string,
		displayName?: string,
		groupName?: string,
		observe?: "body",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<Array<SubmissionDto>>;
	public getAllSubmissions(
		courseId: string,
		skip?: number,
		take?: number,
		userId?: string,
		assignmentId?: string,
		groupId?: string,
		displayName?: string,
		groupName?: string,
		observe?: "response",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpResponse<Array<SubmissionDto>>>;
	public getAllSubmissions(
		courseId: string,
		skip?: number,
		take?: number,
		userId?: string,
		assignmentId?: string,
		groupId?: string,
		displayName?: string,
		groupName?: string,
		observe?: "events",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpEvent<Array<SubmissionDto>>>;
	public getAllSubmissions(
		courseId: string,
		skip?: number,
		take?: number,
		userId?: string,
		assignmentId?: string,
		groupId?: string,
		displayName?: string,
		groupName?: string,
		observe: any = "body",
		reportProgress: boolean = false,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<any> {
		if (courseId === null || courseId === undefined) {
			throw new Error(
				"Required parameter courseId was null or undefined when calling getAllSubmissions."
			);
		}

		let queryParameters = new HttpParams({ encoder: this.encoder });
		if (skip !== undefined && skip !== null) {
			queryParameters = this.addToHttpParams(queryParameters, <any>skip, "skip");
		}
		if (take !== undefined && take !== null) {
			queryParameters = this.addToHttpParams(queryParameters, <any>take, "take");
		}
		if (userId !== undefined && userId !== null) {
			queryParameters = this.addToHttpParams(queryParameters, <any>userId, "userId");
		}
		if (assignmentId !== undefined && assignmentId !== null) {
			queryParameters = this.addToHttpParams(
				queryParameters,
				<any>assignmentId,
				"assignmentId"
			);
		}
		if (groupId !== undefined && groupId !== null) {
			queryParameters = this.addToHttpParams(queryParameters, <any>groupId, "groupId");
		}
		if (displayName !== undefined && displayName !== null) {
			queryParameters = this.addToHttpParams(
				queryParameters,
				<any>displayName,
				"displayName"
			);
		}
		if (groupName !== undefined && groupName !== null) {
			queryParameters = this.addToHttpParams(queryParameters, <any>groupName, "groupName");
		}

		let headers = this.defaultHeaders;

		let credential: string | undefined;
		// authentication (bearer) required
		credential = this.configuration.lookupCredential("bearer");
		if (credential) {
			headers = headers.set("Authorization", "Bearer " + credential);
		}

		let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
		if (httpHeaderAcceptSelected === undefined) {
			// to determine the Accept header
			const httpHeaderAccepts: string[] = ["application/json"];
			httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
		}
		if (httpHeaderAcceptSelected !== undefined) {
			headers = headers.set("Accept", httpHeaderAcceptSelected);
		}

		let responseType_: "text" | "json" = "json";
		if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith("text")) {
			responseType_ = "text";
		}

		return this.httpClient.get<Array<SubmissionDto>>(
			`${this.configuration.basePath}/courses/${encodeURIComponent(
				String(courseId)
			)}/submissions`,
			{
				params: queryParameters,
				responseType: <any>responseType_,
				withCredentials: this.configuration.withCredentials,
				headers: headers,
				observe: observe,
				reportProgress: reportProgress
			}
		);
	}

	/**
	 * Get all submissions of assignment of group.
	 * Retrieves all submissions of a group for a specific assignment.
	 * @param courseId
	 * @param groupId
	 * @param assignmentId
	 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
	 * @param reportProgress flag to report request and response progress.
	 */
	public getAllSubmissionsOfAssignmentOfGroup(
		courseId: string,
		groupId: string,
		assignmentId: string,
		observe?: "body",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<Array<SubmissionDto>>;
	public getAllSubmissionsOfAssignmentOfGroup(
		courseId: string,
		groupId: string,
		assignmentId: string,
		observe?: "response",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpResponse<Array<SubmissionDto>>>;
	public getAllSubmissionsOfAssignmentOfGroup(
		courseId: string,
		groupId: string,
		assignmentId: string,
		observe?: "events",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpEvent<Array<SubmissionDto>>>;
	public getAllSubmissionsOfAssignmentOfGroup(
		courseId: string,
		groupId: string,
		assignmentId: string,
		observe: any = "body",
		reportProgress: boolean = false,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<any> {
		if (courseId === null || courseId === undefined) {
			throw new Error(
				"Required parameter courseId was null or undefined when calling getAllSubmissionsOfAssignmentOfGroup."
			);
		}
		if (groupId === null || groupId === undefined) {
			throw new Error(
				"Required parameter groupId was null or undefined when calling getAllSubmissionsOfAssignmentOfGroup."
			);
		}
		if (assignmentId === null || assignmentId === undefined) {
			throw new Error(
				"Required parameter assignmentId was null or undefined when calling getAllSubmissionsOfAssignmentOfGroup."
			);
		}

		let headers = this.defaultHeaders;

		let credential: string | undefined;
		// authentication (bearer) required
		credential = this.configuration.lookupCredential("bearer");
		if (credential) {
			headers = headers.set("Authorization", "Bearer " + credential);
		}

		let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
		if (httpHeaderAcceptSelected === undefined) {
			// to determine the Accept header
			const httpHeaderAccepts: string[] = ["application/json"];
			httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
		}
		if (httpHeaderAcceptSelected !== undefined) {
			headers = headers.set("Accept", httpHeaderAcceptSelected);
		}

		let responseType_: "text" | "json" = "json";
		if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith("text")) {
			responseType_ = "text";
		}

		return this.httpClient.get<Array<SubmissionDto>>(
			`${this.configuration.basePath}/courses/${encodeURIComponent(
				String(courseId)
			)}/submissions/groups/${encodeURIComponent(
				String(groupId)
			)}/assignments/${encodeURIComponent(String(assignmentId))}`,
			{
				responseType: <any>responseType_,
				withCredentials: this.configuration.withCredentials,
				headers: headers,
				observe: observe,
				reportProgress: reportProgress
			}
		);
	}

	/**
	 * Get all submissions of user.
	 * Retrieves all submissions for an assignment that were submitted by this user (does not include submissions of group members).
	 * @param courseId
	 * @param userId
	 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
	 * @param reportProgress flag to report request and response progress.
	 */
	public getAllSubmissionsOfUser(
		courseId: string,
		userId: string,
		observe?: "body",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<Array<SubmissionDto>>;
	public getAllSubmissionsOfUser(
		courseId: string,
		userId: string,
		observe?: "response",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpResponse<Array<SubmissionDto>>>;
	public getAllSubmissionsOfUser(
		courseId: string,
		userId: string,
		observe?: "events",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpEvent<Array<SubmissionDto>>>;
	public getAllSubmissionsOfUser(
		courseId: string,
		userId: string,
		observe: any = "body",
		reportProgress: boolean = false,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<any> {
		if (courseId === null || courseId === undefined) {
			throw new Error(
				"Required parameter courseId was null or undefined when calling getAllSubmissionsOfUser."
			);
		}
		if (userId === null || userId === undefined) {
			throw new Error(
				"Required parameter userId was null or undefined when calling getAllSubmissionsOfUser."
			);
		}

		let headers = this.defaultHeaders;

		let credential: string | undefined;
		// authentication (bearer) required
		credential = this.configuration.lookupCredential("bearer");
		if (credential) {
			headers = headers.set("Authorization", "Bearer " + credential);
		}

		let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
		if (httpHeaderAcceptSelected === undefined) {
			// to determine the Accept header
			const httpHeaderAccepts: string[] = ["application/json"];
			httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
		}
		if (httpHeaderAcceptSelected !== undefined) {
			headers = headers.set("Accept", httpHeaderAcceptSelected);
		}

		let responseType_: "text" | "json" = "json";
		if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith("text")) {
			responseType_ = "text";
		}

		return this.httpClient.get<Array<SubmissionDto>>(
			`${this.configuration.basePath}/courses/${encodeURIComponent(
				String(courseId)
			)}/submissions/users/${encodeURIComponent(String(userId))}`,
			{
				responseType: <any>responseType_,
				withCredentials: this.configuration.withCredentials,
				headers: headers,
				observe: observe,
				reportProgress: reportProgress
			}
		);
	}

	/**
	 * Get latest submission of assignment.
	 * Retrieves the latest submission of a user or their group for a specific assignment.
	 * @param courseId
	 * @param userId
	 * @param assignmentId
	 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
	 * @param reportProgress flag to report request and response progress.
	 */
	public getLatestSubmissionOfAssignment(
		courseId: string,
		userId: string,
		assignmentId: string,
		observe?: "body",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<SubmissionDto>;
	public getLatestSubmissionOfAssignment(
		courseId: string,
		userId: string,
		assignmentId: string,
		observe?: "response",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpResponse<SubmissionDto>>;
	public getLatestSubmissionOfAssignment(
		courseId: string,
		userId: string,
		assignmentId: string,
		observe?: "events",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpEvent<SubmissionDto>>;
	public getLatestSubmissionOfAssignment(
		courseId: string,
		userId: string,
		assignmentId: string,
		observe: any = "body",
		reportProgress: boolean = false,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<any> {
		if (courseId === null || courseId === undefined) {
			throw new Error(
				"Required parameter courseId was null or undefined when calling getLatestSubmissionOfAssignment."
			);
		}
		if (userId === null || userId === undefined) {
			throw new Error(
				"Required parameter userId was null or undefined when calling getLatestSubmissionOfAssignment."
			);
		}
		if (assignmentId === null || assignmentId === undefined) {
			throw new Error(
				"Required parameter assignmentId was null or undefined when calling getLatestSubmissionOfAssignment."
			);
		}

		let headers = this.defaultHeaders;

		let credential: string | undefined;
		// authentication (bearer) required
		credential = this.configuration.lookupCredential("bearer");
		if (credential) {
			headers = headers.set("Authorization", "Bearer " + credential);
		}

		let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
		if (httpHeaderAcceptSelected === undefined) {
			// to determine the Accept header
			const httpHeaderAccepts: string[] = ["application/json"];
			httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
		}
		if (httpHeaderAcceptSelected !== undefined) {
			headers = headers.set("Accept", httpHeaderAcceptSelected);
		}

		let responseType_: "text" | "json" = "json";
		if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith("text")) {
			responseType_ = "text";
		}

		return this.httpClient.get<SubmissionDto>(
			`${this.configuration.basePath}/courses/${encodeURIComponent(
				String(courseId)
			)}/submissions/users/${encodeURIComponent(
				String(userId)
			)}/assignments/${encodeURIComponent(String(assignmentId))}`,
			{
				responseType: <any>responseType_,
				withCredentials: this.configuration.withCredentials,
				headers: headers,
				observe: observe,
				reportProgress: reportProgress
			}
		);
	}

	/**
	 * Remove all submissions of assignment
	 * Removes all submissions of an assignment.
	 * @param courseId
	 * @param assignmentId
	 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
	 * @param reportProgress flag to report request and response progress.
	 */
	public removeAllSubmissionsOfAssignment(
		courseId: string,
		assignmentId: string,
		observe?: "body",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<any>;
	public removeAllSubmissionsOfAssignment(
		courseId: string,
		assignmentId: string,
		observe?: "response",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<HttpResponse<any>>;
	public removeAllSubmissionsOfAssignment(
		courseId: string,
		assignmentId: string,
		observe?: "events",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<HttpEvent<any>>;
	public removeAllSubmissionsOfAssignment(
		courseId: string,
		assignmentId: string,
		observe: any = "body",
		reportProgress: boolean = false,
		options?: { httpHeaderAccept?: undefined }
	): Observable<any> {
		if (courseId === null || courseId === undefined) {
			throw new Error(
				"Required parameter courseId was null or undefined when calling removeAllSubmissionsOfAssignment."
			);
		}
		if (assignmentId === null || assignmentId === undefined) {
			throw new Error(
				"Required parameter assignmentId was null or undefined when calling removeAllSubmissionsOfAssignment."
			);
		}

		let headers = this.defaultHeaders;

		let credential: string | undefined;
		// authentication (bearer) required
		credential = this.configuration.lookupCredential("bearer");
		if (credential) {
			headers = headers.set("Authorization", "Bearer " + credential);
		}

		let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
		if (httpHeaderAcceptSelected === undefined) {
			// to determine the Accept header
			const httpHeaderAccepts: string[] = [];
			httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
		}
		if (httpHeaderAcceptSelected !== undefined) {
			headers = headers.set("Accept", httpHeaderAcceptSelected);
		}

		let responseType_: "text" | "json" = "json";
		if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith("text")) {
			responseType_ = "text";
		}

		return this.httpClient.delete<any>(
			`${this.configuration.basePath}/courses/${encodeURIComponent(
				String(courseId)
			)}/submissions/assignments/${encodeURIComponent(String(assignmentId))}`,
			{
				responseType: <any>responseType_,
				withCredentials: this.configuration.withCredentials,
				headers: headers,
				observe: observe,
				reportProgress: reportProgress
			}
		);
	}
}