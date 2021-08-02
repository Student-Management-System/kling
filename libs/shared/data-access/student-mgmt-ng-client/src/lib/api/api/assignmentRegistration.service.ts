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

import { GroupDto } from "../model/models";

import { BASE_PATH, COLLECTION_FORMATS } from "../variables";
import { Configuration } from "../configuration";

@Injectable({
	providedIn: "root"
})
export class AssignmentRegistrationService {
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
	 * Get registered group.
	 * Retrieves all registered groups and their members for the specified assignment.
	 * @param courseId
	 * @param assignmentId
	 * @param groupId
	 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
	 * @param reportProgress flag to report request and response progress.
	 */
	public getRegisteredGroup(
		courseId: string,
		assignmentId: string,
		groupId: string,
		observe?: "body",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<GroupDto>;
	public getRegisteredGroup(
		courseId: string,
		assignmentId: string,
		groupId: string,
		observe?: "response",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpResponse<GroupDto>>;
	public getRegisteredGroup(
		courseId: string,
		assignmentId: string,
		groupId: string,
		observe?: "events",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpEvent<GroupDto>>;
	public getRegisteredGroup(
		courseId: string,
		assignmentId: string,
		groupId: string,
		observe: any = "body",
		reportProgress: boolean = false,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<any> {
		if (courseId === null || courseId === undefined) {
			throw new Error(
				"Required parameter courseId was null or undefined when calling getRegisteredGroup."
			);
		}
		if (assignmentId === null || assignmentId === undefined) {
			throw new Error(
				"Required parameter assignmentId was null or undefined when calling getRegisteredGroup."
			);
		}
		if (groupId === null || groupId === undefined) {
			throw new Error(
				"Required parameter groupId was null or undefined when calling getRegisteredGroup."
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

		return this.httpClient.get<GroupDto>(
			`${this.configuration.basePath}/courses/${encodeURIComponent(
				String(courseId)
			)}/assignments/${encodeURIComponent(
				String(assignmentId)
			)}/registrations/groups/${encodeURIComponent(String(groupId))}`,
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
	 * Get registered group of user.
	 * Retrieves the group that the participant is registered with for the specified assignment.
	 * @param courseId
	 * @param assignmentId
	 * @param userId
	 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
	 * @param reportProgress flag to report request and response progress.
	 */
	public getRegisteredGroupOfUser(
		courseId: string,
		assignmentId: string,
		userId: string,
		observe?: "body",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<GroupDto>;
	public getRegisteredGroupOfUser(
		courseId: string,
		assignmentId: string,
		userId: string,
		observe?: "response",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpResponse<GroupDto>>;
	public getRegisteredGroupOfUser(
		courseId: string,
		assignmentId: string,
		userId: string,
		observe?: "events",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpEvent<GroupDto>>;
	public getRegisteredGroupOfUser(
		courseId: string,
		assignmentId: string,
		userId: string,
		observe: any = "body",
		reportProgress: boolean = false,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<any> {
		if (courseId === null || courseId === undefined) {
			throw new Error(
				"Required parameter courseId was null or undefined when calling getRegisteredGroupOfUser."
			);
		}
		if (assignmentId === null || assignmentId === undefined) {
			throw new Error(
				"Required parameter assignmentId was null or undefined when calling getRegisteredGroupOfUser."
			);
		}
		if (userId === null || userId === undefined) {
			throw new Error(
				"Required parameter userId was null or undefined when calling getRegisteredGroupOfUser."
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

		return this.httpClient.get<GroupDto>(
			`${this.configuration.basePath}/courses/${encodeURIComponent(
				String(courseId)
			)}/assignments/${encodeURIComponent(
				String(assignmentId)
			)}/registrations/users/${encodeURIComponent(String(userId))}`,
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
	 * Get registered groups.
	 * Retrieves all registered groups and their members for the specified assignment.
	 * @param courseId
	 * @param assignmentId
	 * @param skip [Pagination] The amount of elements that should be skipped.
	 * @param take [Pagination] The amount of elements that should be included in the response.
	 * @param groupname
	 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
	 * @param reportProgress flag to report request and response progress.
	 */
	public getRegisteredGroups(
		courseId: string,
		assignmentId: string,
		skip?: number,
		take?: number,
		groupname?: string,
		observe?: "body",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<Array<GroupDto>>;
	public getRegisteredGroups(
		courseId: string,
		assignmentId: string,
		skip?: number,
		take?: number,
		groupname?: string,
		observe?: "response",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpResponse<Array<GroupDto>>>;
	public getRegisteredGroups(
		courseId: string,
		assignmentId: string,
		skip?: number,
		take?: number,
		groupname?: string,
		observe?: "events",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<HttpEvent<Array<GroupDto>>>;
	public getRegisteredGroups(
		courseId: string,
		assignmentId: string,
		skip?: number,
		take?: number,
		groupname?: string,
		observe: any = "body",
		reportProgress: boolean = false,
		options?: { httpHeaderAccept?: "application/json" }
	): Observable<any> {
		if (courseId === null || courseId === undefined) {
			throw new Error(
				"Required parameter courseId was null or undefined when calling getRegisteredGroups."
			);
		}
		if (assignmentId === null || assignmentId === undefined) {
			throw new Error(
				"Required parameter assignmentId was null or undefined when calling getRegisteredGroups."
			);
		}

		let queryParameters = new HttpParams({ encoder: this.encoder });
		if (skip !== undefined && skip !== null) {
			queryParameters = this.addToHttpParams(queryParameters, <any>skip, "skip");
		}
		if (take !== undefined && take !== null) {
			queryParameters = this.addToHttpParams(queryParameters, <any>take, "take");
		}
		if (groupname !== undefined && groupname !== null) {
			queryParameters = this.addToHttpParams(queryParameters, <any>groupname, "groupname");
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

		return this.httpClient.get<Array<GroupDto>>(
			`${this.configuration.basePath}/courses/${encodeURIComponent(
				String(courseId)
			)}/assignments/${encodeURIComponent(String(assignmentId))}/registrations/groups`,
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
	 * Registers all groups.
	 * Registers all groups with their current members for the assignment. Should only be used for testing or when automatic registration fails.
	 * @param courseId
	 * @param assignmentId
	 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
	 * @param reportProgress flag to report request and response progress.
	 */
	public registerAllGroups(
		courseId: string,
		assignmentId: string,
		observe?: "body",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<any>;
	public registerAllGroups(
		courseId: string,
		assignmentId: string,
		observe?: "response",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<HttpResponse<any>>;
	public registerAllGroups(
		courseId: string,
		assignmentId: string,
		observe?: "events",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<HttpEvent<any>>;
	public registerAllGroups(
		courseId: string,
		assignmentId: string,
		observe: any = "body",
		reportProgress: boolean = false,
		options?: { httpHeaderAccept?: undefined }
	): Observable<any> {
		if (courseId === null || courseId === undefined) {
			throw new Error(
				"Required parameter courseId was null or undefined when calling registerAllGroups."
			);
		}
		if (assignmentId === null || assignmentId === undefined) {
			throw new Error(
				"Required parameter assignmentId was null or undefined when calling registerAllGroups."
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

		return this.httpClient.post<any>(
			`${this.configuration.basePath}/courses/${encodeURIComponent(
				String(courseId)
			)}/assignments/${encodeURIComponent(String(assignmentId))}/registrations`,
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
	 * Register group.
	 * Registers a group and its members for the assignment.
	 * @param courseId
	 * @param assignmentId
	 * @param groupId
	 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
	 * @param reportProgress flag to report request and response progress.
	 */
	public registerGroup(
		courseId: string,
		assignmentId: string,
		groupId: string,
		observe?: "body",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<any>;
	public registerGroup(
		courseId: string,
		assignmentId: string,
		groupId: string,
		observe?: "response",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<HttpResponse<any>>;
	public registerGroup(
		courseId: string,
		assignmentId: string,
		groupId: string,
		observe?: "events",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<HttpEvent<any>>;
	public registerGroup(
		courseId: string,
		assignmentId: string,
		groupId: string,
		observe: any = "body",
		reportProgress: boolean = false,
		options?: { httpHeaderAccept?: undefined }
	): Observable<any> {
		if (courseId === null || courseId === undefined) {
			throw new Error(
				"Required parameter courseId was null or undefined when calling registerGroup."
			);
		}
		if (assignmentId === null || assignmentId === undefined) {
			throw new Error(
				"Required parameter assignmentId was null or undefined when calling registerGroup."
			);
		}
		if (groupId === null || groupId === undefined) {
			throw new Error(
				"Required parameter groupId was null or undefined when calling registerGroup."
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

		return this.httpClient.post<any>(
			`${this.configuration.basePath}/courses/${encodeURIComponent(
				String(courseId)
			)}/assignments/${encodeURIComponent(
				String(assignmentId)
			)}/registrations/groups/${encodeURIComponent(String(groupId))}`,
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
	 * Register participant as group member.
	 * Registers a participant as a member of the specified group for the assignment.
	 * @param courseId
	 * @param assignmentId
	 * @param groupId
	 * @param userId
	 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
	 * @param reportProgress flag to report request and response progress.
	 */
	public registerParticipantAsGroupMember(
		courseId: string,
		assignmentId: string,
		groupId: string,
		userId: string,
		observe?: "body",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<any>;
	public registerParticipantAsGroupMember(
		courseId: string,
		assignmentId: string,
		groupId: string,
		userId: string,
		observe?: "response",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<HttpResponse<any>>;
	public registerParticipantAsGroupMember(
		courseId: string,
		assignmentId: string,
		groupId: string,
		userId: string,
		observe?: "events",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<HttpEvent<any>>;
	public registerParticipantAsGroupMember(
		courseId: string,
		assignmentId: string,
		groupId: string,
		userId: string,
		observe: any = "body",
		reportProgress: boolean = false,
		options?: { httpHeaderAccept?: undefined }
	): Observable<any> {
		if (courseId === null || courseId === undefined) {
			throw new Error(
				"Required parameter courseId was null or undefined when calling registerParticipantAsGroupMember."
			);
		}
		if (assignmentId === null || assignmentId === undefined) {
			throw new Error(
				"Required parameter assignmentId was null or undefined when calling registerParticipantAsGroupMember."
			);
		}
		if (groupId === null || groupId === undefined) {
			throw new Error(
				"Required parameter groupId was null or undefined when calling registerParticipantAsGroupMember."
			);
		}
		if (userId === null || userId === undefined) {
			throw new Error(
				"Required parameter userId was null or undefined when calling registerParticipantAsGroupMember."
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

		return this.httpClient.post<any>(
			`${this.configuration.basePath}/courses/${encodeURIComponent(
				String(courseId)
			)}/assignments/${encodeURIComponent(
				String(assignmentId)
			)}/registrations/groups/${encodeURIComponent(
				String(groupId)
			)}/members/${encodeURIComponent(String(userId))}`,
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
	 * Unregister all.
	 * Removes all registrations for the specified assignment.
	 * @param courseId
	 * @param assignmentId
	 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
	 * @param reportProgress flag to report request and response progress.
	 */
	public unregisterAll(
		courseId: string,
		assignmentId: string,
		observe?: "body",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<any>;
	public unregisterAll(
		courseId: string,
		assignmentId: string,
		observe?: "response",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<HttpResponse<any>>;
	public unregisterAll(
		courseId: string,
		assignmentId: string,
		observe?: "events",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<HttpEvent<any>>;
	public unregisterAll(
		courseId: string,
		assignmentId: string,
		observe: any = "body",
		reportProgress: boolean = false,
		options?: { httpHeaderAccept?: undefined }
	): Observable<any> {
		if (courseId === null || courseId === undefined) {
			throw new Error(
				"Required parameter courseId was null or undefined when calling unregisterAll."
			);
		}
		if (assignmentId === null || assignmentId === undefined) {
			throw new Error(
				"Required parameter assignmentId was null or undefined when calling unregisterAll."
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
			)}/assignments/${encodeURIComponent(String(assignmentId))}/registrations`,
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
	 * Unregister group.
	 * Removes the registration of a group and its members for this assignment.
	 * @param courseId
	 * @param assignmentId
	 * @param groupId
	 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
	 * @param reportProgress flag to report request and response progress.
	 */
	public unregisterGroup(
		courseId: string,
		assignmentId: string,
		groupId: string,
		observe?: "body",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<any>;
	public unregisterGroup(
		courseId: string,
		assignmentId: string,
		groupId: string,
		observe?: "response",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<HttpResponse<any>>;
	public unregisterGroup(
		courseId: string,
		assignmentId: string,
		groupId: string,
		observe?: "events",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<HttpEvent<any>>;
	public unregisterGroup(
		courseId: string,
		assignmentId: string,
		groupId: string,
		observe: any = "body",
		reportProgress: boolean = false,
		options?: { httpHeaderAccept?: undefined }
	): Observable<any> {
		if (courseId === null || courseId === undefined) {
			throw new Error(
				"Required parameter courseId was null or undefined when calling unregisterGroup."
			);
		}
		if (assignmentId === null || assignmentId === undefined) {
			throw new Error(
				"Required parameter assignmentId was null or undefined when calling unregisterGroup."
			);
		}
		if (groupId === null || groupId === undefined) {
			throw new Error(
				"Required parameter groupId was null or undefined when calling unregisterGroup."
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
			)}/assignments/${encodeURIComponent(
				String(assignmentId)
			)}/registrations/groups/${encodeURIComponent(String(groupId))}`,
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
	 * Unregister user.
	 * Removes the registration of a user for the specified assignment.
	 * @param courseId
	 * @param assignmentId
	 * @param userId
	 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
	 * @param reportProgress flag to report request and response progress.
	 */
	public unregisterUser(
		courseId: string,
		assignmentId: string,
		userId: string,
		observe?: "body",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<any>;
	public unregisterUser(
		courseId: string,
		assignmentId: string,
		userId: string,
		observe?: "response",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<HttpResponse<any>>;
	public unregisterUser(
		courseId: string,
		assignmentId: string,
		userId: string,
		observe?: "events",
		reportProgress?: boolean,
		options?: { httpHeaderAccept?: undefined }
	): Observable<HttpEvent<any>>;
	public unregisterUser(
		courseId: string,
		assignmentId: string,
		userId: string,
		observe: any = "body",
		reportProgress: boolean = false,
		options?: { httpHeaderAccept?: undefined }
	): Observable<any> {
		if (courseId === null || courseId === undefined) {
			throw new Error(
				"Required parameter courseId was null or undefined when calling unregisterUser."
			);
		}
		if (assignmentId === null || assignmentId === undefined) {
			throw new Error(
				"Required parameter assignmentId was null or undefined when calling unregisterUser."
			);
		}
		if (userId === null || userId === undefined) {
			throw new Error(
				"Required parameter userId was null or undefined when calling unregisterUser."
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
			)}/assignments/${encodeURIComponent(
				String(assignmentId)
			)}/registrations/users/${encodeURIComponent(String(userId))}`,
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