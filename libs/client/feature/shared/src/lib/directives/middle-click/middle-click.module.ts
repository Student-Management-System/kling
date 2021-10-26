import { NgModule } from "@angular/core";
import { MiddleClickDirective } from "./middle-click.directive";

@NgModule({
	declarations: [MiddleClickDirective],
	exports: [MiddleClickDirective]
})
export class MiddleClickModule {}
