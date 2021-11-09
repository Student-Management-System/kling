import { NgModule, Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "firstChar" })
export class FirstCharacterPipe implements PipeTransform {
	transform(value?: string | null): string {
		if (!value || value.length == 0) {
			return "?";
		}

		return value[0];
	}
}

@NgModule({
	declarations: [FirstCharacterPipe],
	exports: [FirstCharacterPipe]
})
export class FirstCharacterPipeModule {}
