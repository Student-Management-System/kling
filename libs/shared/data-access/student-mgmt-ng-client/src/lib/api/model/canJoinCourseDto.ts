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

export interface CanJoinCourseDto {
	/**
	 * Indicates, wether the joining the course is possible.
	 */
	canJoin: boolean;
	/**
	 * Indicates, wether the joining the course requires a password.
	 */
	requiresPassword?: boolean;
	/**
	 * The reason why joining the course is not possible.
	 */
	reason?: CanJoinCourseDto.ReasonEnum;
}
export namespace CanJoinCourseDto {
	export type ReasonEnum = "CLOSED" | "IS_MEMBER";
	export const ReasonEnum = {
		Closed: "CLOSED" as ReasonEnum,
		IsMember: "IS_MEMBER" as ReasonEnum
	};
}