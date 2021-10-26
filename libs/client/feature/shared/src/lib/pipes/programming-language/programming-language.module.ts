import { NgModule } from "@angular/core";
import { ProgrammingLanguagePipe } from "./programming-language.pipe";

@NgModule({
	declarations: [ProgrammingLanguagePipe],
	exports: [ProgrammingLanguagePipe]
})
export class ProgrammingLanguageModule {}
