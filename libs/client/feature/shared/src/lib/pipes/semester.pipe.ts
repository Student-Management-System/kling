import { NgModule, Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "semester"
})
export class SemesterPipe implements PipeTransform {
	private readonly regex: RegExp = /^(wise|sose)\d{4}$/g;

	transform(value: string): string {
		if (!value || value === "") {
			return value;
		}

		if (!this.regex.test(value)) return "?";

		let semName = value.substring(0, 4); // wise or sose
		let semYear = value.substring(4); // i.e 2020

		if (semName === "wise") {
			semName = "WiSe";
			semYear = value.substring(4, 6) + "/" + value.substring(6); // i.e 1920 -> 19/20
		} else {
			semName = "SoSe";
		}

		return `${semName} ${semYear}`;
	}
}

@NgModule({
	declarations: [SemesterPipe],
	exports: [SemesterPipe]
})
export class SemesterPipeModule {}
