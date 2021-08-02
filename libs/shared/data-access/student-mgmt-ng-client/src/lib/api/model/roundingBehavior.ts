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

export interface RoundingBehavior {
	type: RoundingBehavior.TypeEnum;
	decimals?: number;
}
export namespace RoundingBehavior {
	export type TypeEnum = "NONE" | "DECIMALS" | "DOWN_NEAREST_INTEGER" | "UP_NEAREST_INTEGER";
	export const TypeEnum = {
		None: "NONE" as TypeEnum,
		Decimals: "DECIMALS" as TypeEnum,
		DownNearestInteger: "DOWN_NEAREST_INTEGER" as TypeEnum,
		UpNearestInteger: "UP_NEAREST_INTEGER" as TypeEnum
	};
}