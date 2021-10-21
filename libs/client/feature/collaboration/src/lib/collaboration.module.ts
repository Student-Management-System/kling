import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { getEnvVariableOrThrow } from "@kling/client-environments";
import { IconModule } from "@kling/client/shared/components";
import { CollaborationService } from "./collaboration.service";
import { CollaborationRoutingModule } from "./collaboration-routing.module";
import { CONVERGENCE_REALTIME_API_URL } from "./collaboration.service";
import { CollaborationComponent } from "./collaboration/collaboration.component";

@NgModule({
	imports: [CommonModule, CollaborationRoutingModule, IconModule, FormsModule],
	declarations: [CollaborationComponent],
	exports: [CollaborationComponent],
	providers: [
		CollaborationService,
		{
			provide: CONVERGENCE_REALTIME_API_URL,
			useValue: getEnvVariableOrThrow("CONVERGENCE_REALTIME_API_PATH")
		}
	]
})
export class CollaborationModule {}
