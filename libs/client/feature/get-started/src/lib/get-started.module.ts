import { NgModule } from "@angular/core";
import { SharedModule } from "@kling/client-shared";
import { GetStartedComponent } from "./components/get-started/get-started.component";

@NgModule({
	imports: [SharedModule],
	declarations: [GetStartedComponent],
	exports: [GetStartedComponent]
})
export class GetStartedModule {}
