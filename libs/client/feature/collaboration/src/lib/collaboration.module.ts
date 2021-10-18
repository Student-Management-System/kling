import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "@kling/client-shared";
import { CollaborationRoutingModule } from "./collaboration-routing.module";
import { CollaborationComponent } from "./collaboration/collaboration.component";

@NgModule({
	imports: [SharedModule, CollaborationRoutingModule, FormsModule],
	declarations: [CollaborationComponent],
	exports: [CollaborationComponent]
})
export class CollaborationModule {}
