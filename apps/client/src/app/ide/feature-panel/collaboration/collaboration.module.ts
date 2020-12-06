import { NgModule } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";
import { ChatComponent } from "./components/chat/chat.component";
import { CollaborationComponent } from "./components/collaboration/collaboration.component";
import { CollaboratorsComponent } from "./components/collaborators/collaborators.component";
import { CollaborationService } from "./services/collaboration.service";

@NgModule({
	declarations: [CollaborationComponent, CollaboratorsComponent, ChatComponent],
	imports: [SharedModule],
	providers: [CollaborationService],
	exports: [CollaborationComponent]
})
export class CollaborationModule {}
