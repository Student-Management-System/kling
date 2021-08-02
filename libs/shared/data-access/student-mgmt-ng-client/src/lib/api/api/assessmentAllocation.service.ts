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

import { AssessmentAllocationDto } from "../model/models";

import { BASE_PATH, COLLECTION_FORMATS } from "../variables";
import { Configuration } from "../configuration";

@Injectable({
	providedIn: "root"
})
export class AssessmentAllocationService {
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
	 * Copy assessment allocation from another assignment.
	 * Applies the allocations from another assignment to the specified assignment.
	 * @param courseId
	 * @param assignmentId
	 * @param existingAssignmentId
	 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
	 * @param reportProgress flag to report request and response progress.
	 */
	public addAllocationsFromExistingAssignment(
		courseId: string,
		assignmentId: string,
		existingAssignmentId: string,
		observe?: "body",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<Array<AssessmentAllocationDto>>;
	public addAllocationsFromExistingAssignment(
		courseId: string,
		assignmentId: string,
		existingAssignmentId: string,
		observe?: "response",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpResponse<Array<AssessmentAllocationDto>>>;
	public addAllocationsFromExistingAssignment(
		courseId: string,
		assignmentId: string,
		existingAssignmentId: string,
		observe?: "events",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpEvent<Array<AssessmentAllocationDto>>>;
	public addAllocationsFromExistingAssignment(
		courseId: string,
		assignmentId: string,
		existingAssignmentId: string,
		observe: any = "body",
		reportProgress: boolean = false,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<any> {
		if (courseId === null || courseId === undefined) {
			throw new Error(
				"Required parameter courseId was null or undefined when calling addAllocationsFromExistingAssignment."
			);
		}
		if (assignmentId === null || assignmentId === undefined) {
			throw new Error(
				"Required parameter assignmentId was null or undefined when calling addAllocationsFromExistingAssignment."
			);
		}
		if (existingAssignmentId === null || existingAssignmentId === undefined) {
			throw new Error(
				"Required parameter existingAssignmentId was null or undefined when calling addAllocationsFromExistingAssignment."
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

		return this.httpClient.post<Array<AssessmentAllocationDto>>(
			`${this.configuration.basePath}/courses/${encodeURIComponent(
				String(courseId)
			)}/assignments/${encodeURIComponent(
				String(assignmentId)
			)}/assessment-allocations/from-existing/${encodeURIComponent(
				String(existingAssignmentId)
			)}`,
			null,
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
	 * @param courseId
	 * @param assignmentId
	 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
	 * @param reportProgress flag to report request and response progress.
	 */
	public assessmentAllocationControllerRemoveAllAllocationsOfAssignment(
		courseId: string,
		assignmentId: string,
		observe?: "body",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<any>;
	public assessmentAllocationControllerRemoveAllAllocationsOfAssignment(
		courseId: string,
		assignmentId: string,
		observe?: "response",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<HttpResponse<any>>;
	public assessmentAllocationControllerRemoveAllAllocationsOfAssignment(
		courseId: string,
		assignmentId: string,
		observe?: "events",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<HttpEvent<any>>;
	public assessmentAllocationControllerRemoveAllAllocationsOfAssignment(
		courseId: string,
		assignmentId: string,
		observe: any = "body",
		reportProgress: boolean = false,
		options?: { httpHeaderAccept?: undefined }
	): Observable<any> {
		if (courseId === null || courseId === undefined) {
			throw new Error(
				"Required parameter courseId was null or undefined when calling assessmentAllocationControllerRemoveAllAllocationsOfAssignment."
			);
		}
		if (assignmentId === null || assignmentId === undefined) {
			throw new Error(
				"Required parameter assignmentId was null or undefined when calling assessmentAllocationControllerRemoveAllAllocationsOfAssignment."
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
			)}/assignments/${encodeURIComponent(String(assignmentId))}/assessment-allocations/all`,
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
	 * Assign assessment to evaluator.
	 * Maps an evaluator to a group or user. If the group or user is already assigned to another evaluator, changes the evaluator.
	 * @param courseId
	 * @param assignmentId
	 * @param assessmentAllocationDto
	 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
	 * @param reportProgress flag to report request and response progress.
	 */
	public createAllocation(
		courseId: string,
		assignmentId: string,
		assessmentAllocationDto: AssessmentAllocationDto,
		observe?: "body",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<AssessmentAllocationDto>;
	public createAllocation(
		courseId: string,
		assignmentId: string,
		assessmentAllocationDto: AssessmentAllocationDto,
		observe?: "response",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpResponse<AssessmentAllocationDto>>;
	public createAllocation(
		courseId: string,
		assignmentId: string,
		assessmentAllocationDto: AssessmentAllocationDto,
		observe?: "events",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpEvent<AssessmentAllocationDto>>;
	public createAllocation(
		courseId: string,
		assignmentId: string,
		assessmentAllocationDto: AssessmentAllocationDto,
		observe: any = "body",
		reportProgress: boolean = false,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<any> {
		if (courseId === null || courseId === undefined) {
			throw new Error(
				"Required parameter courseId was null or undefined when calling createAllocation."
			);
		}
		if (assignmentId === null || assignmentId === undefined) {
			throw new Error(
				"Required parameter assignmentId was null or undefined when calling createAllocation."
			);
		}
		if (assessmentAllocationDto === null || assessmentAllocationDto === undefined) {
			throw new Error(
				"Required parameter assessmentAllocationDto was null or undefined when calling createAllocation."
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

		return this.httpClient.post<AssessmentAllocationDto>(
			`${this.configuration.basePath}/courses/${encodeURIComponent(
				String(courseId)
			)}/assignments/${encodeURIComponent(String(assignmentId))}/assessment-allocations`,
			assessmentAllocationDto,
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
	 * Get assessment allocations.
	 * Returns a list of allocations, which map an evaluator to a group or user.
	 * @param courseId
	 * @param assignmentId
	 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
	 * @param reportProgress flag to report request and response progress.
	 */
	public getAllocations(
		courseId: string,
		assignmentId: string,
		observe?: "body",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<Array<AssessmentAllocationDto>>;
	public getAllocations(
		courseId: string,
		assignmentId: string,
		observe?: "response",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpResponse<Array<AssessmentAllocationDto>>>;
	public getAllocations(
		courseId: string,
		assignmentId: string,
		observe?: "events",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpEvent<Array<AssessmentAllocationDto>>>;
	public getAllocations(
		courseId: string,
		assignmentId: string,
		observe: any = "body",
		reportProgress: boolean = false,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<any> {
		if (courseId === null || courseId === undefined) {
			throw new Error(
				"Required parameter courseId was null or undefined when calling getAllocations."
			);
		}
		if (assignmentId === null || assignmentId === undefined) {
			throw new Error(
				"Required parameter assignmentId was null or undefined when calling getAllocations."
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

		return this.httpClient.get<Array<AssessmentAllocationDto>>(
			`${this.configuration.basePath}/courses/${encodeURIComponent(
				String(courseId)
			)}/assignments/${encodeURIComponent(String(assignmentId))}/assessment-allocations`,
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
	 * Remove allocation.
	 * Removes the assignment of the specified group or user. Throws error, if removal was unsuccessful.
	 * @param courseId
	 * @param assignmentId
	 * @param groupId Query must specify either groupId or userId.
	 * @param userId Query must specify either groupId or userId.
	 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
	 * @param reportProgress flag to report request and response progress.
	 */
	public removeAllocation(
		courseId: string,
		assignmentId: string,
		groupId?: string,
		userId?: string,
		observe?: "body",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<any>;
	public removeAllocation(
		courseId: string,
		assignmentId: string,
		groupId?: string,
		userId?: string,
		observe?: "response",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<HttpResponse<any>>;
	public removeAllocation(
		courseId: string,
		assignmentId: string,
		groupId?: string,
		userId?: string,
		observe?: "events",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<HttpEvent<any>>;
	public removeAllocation(
		courseId: string,
		assignmentId: string,
		groupId?: string,
		userId?: string,
		observe: any = "body",
		reportProgress: boolean = false,
		options?: { httpHeaderAccept?: undefined }
	): Observable<any> {
		if (courseId === null || courseId === undefined) {
			throw new Error(
				"Required parameter courseId was null or undefined when calling removeAllocation."
			);
		}
		if (assignmentId === null || assignmentId === undefined) {
			throw new Error(
				"Required parameter assignmentId was null or undefined when calling removeAllocation."
			);
		}

		let queryParameters = new HttpParams({ encoder: this.encoder });
		if (groupId !== undefined && groupId !== null) {
			queryParameters = this.addToHttpParams(queryParameters, <any>groupId, "groupId");
		}
		if (userId !== undefined && userId !== null) {
			queryParameters = this.addToHttpParams(queryParameters, <any>userId, "userId");
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
			)}/assignments/${encodeURIComponent(String(assignmentId))}/assessment-allocations`,
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
}