import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";
import { getEnvVariableOrThrow } from "@kling/client-environments";
import { IconModule } from "@kling/client/shared/components";
import { TranslateModule } from "@ngx-translate/core";
import { CONVERGENCE_REALTIME_API_URL } from "./collaboration.service";
import { CollaborationComponent } from "./collaboration/collaboration.component";
import { FirstCharacterPipeModule } from "@kling/client-shared";

@NgModule({
	imports: [
		CommonModule,
		IconModule,
		FormsModule,
		MatTooltipModule,
		TranslateModule,
		FirstCharacterPipeModule
	],
	declarations: [CollaborationComponent],
	exports: [CollaborationComponent],
	providers: [
		{
			provide: CONVERGENCE_REALTIME_API_URL,
			useValue: getEnvVariableOrThrow("CONVERGENCE_REALTIME_API_PATH")
		}
	]
})
export class CollaborationModule {}
