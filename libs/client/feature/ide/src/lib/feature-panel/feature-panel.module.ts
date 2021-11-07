import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { RouterModule } from "@angular/router";
import { CollaborationModule } from "@kling/collaboration";
import { ExerciseSubmitterModule } from "@kling/exercise-submitter";
import { TranslateModule } from "@ngx-translate/core";
import { FeaturePanelComponent } from "./components/feature-panel/feature-panel.component";
import { InteractiveTerminalModule } from "./components/interactive-terminal/interactive-terminal.component";
import { ProblemViewComponent } from "./components/problem-view/problem-view.component";
import { TerminalModule } from "./components/terminal/terminal.module";
import { TestingViewComponent } from "./components/testing-view/testing-view.component";
import { TerminalService } from "./services/terminal.service";

@NgModule({
	declarations: [FeaturePanelComponent, ProblemViewComponent, TestingViewComponent],
	imports: [
		CommonModule,
		RouterModule,
		MatTabsModule,
		TerminalModule,
		InteractiveTerminalModule,
		CollaborationModule,
		ExerciseSubmitterModule,
		TranslateModule
	],
	exports: [FeaturePanelComponent],
	providers: [TerminalService]
})
export class FeaturePanelModule {}
