import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IconModule } from "@kling/client/shared/components";
import { CollaborationRoutingModule } from "./collaboration-routing.module";
import { CollaborationComponent } from "./collaboration/collaboration.component";

@NgModule({
	imports: [CommonModule, CollaborationRoutingModule, IconModule, FormsModule],
	declarations: [CollaborationComponent],
	exports: [CollaborationComponent]
})
export class CollaborationModule {}
