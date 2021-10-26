import { NgModule } from "@angular/core";
import { CollaborationModule } from "@kling/collaboration";
import { FeaturePanelComponent } from "./components/feature-panel/feature-panel.component";
import { ProblemViewComponent } from "./components/problem-view/problem-view.component";
import { TerminalModule } from "./components/terminal/terminal.module";
import { TestingViewComponent } from "./components/testing-view/testing-view.component";
import { TerminalService } from "./services/terminal.service";
import { MatTabsModule } from "@angular/material/tabs";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [FeaturePanelComponent, ProblemViewComponent, TestingViewComponent],
	imports: [MatTabsModule, TerminalModule, CollaborationModule, TranslateModule],
	exports: [FeaturePanelComponent],
	providers: [TerminalService]
})
export class FeaturePanelModule {}
