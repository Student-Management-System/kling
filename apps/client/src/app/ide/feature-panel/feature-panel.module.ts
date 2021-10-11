import { NgModule } from "@angular/core";
import { SharedModule } from "@kling/client-shared";
import { MarkdownModule } from "ngx-markdown";
import { CollaborationModule } from "./collaboration/collaboration.module";
import { FeaturePanelComponent } from "./components/feature-panel/feature-panel.component";
import { ProblemViewComponent } from "./components/problem-view/problem-view.component";
import { TerminalModule } from "./components/terminal/terminal.module";
import { TestingViewComponent } from "./components/testing-view/testing-view.component";
import { TerminalService } from "./services/terminal.service";

@NgModule({
	declarations: [FeaturePanelComponent, ProblemViewComponent, TestingViewComponent],
	imports: [SharedModule, MarkdownModule.forChild(), CollaborationModule, TerminalModule],
	exports: [FeaturePanelComponent],
	providers: [TerminalService]
})
export class FeaturePanelModule {}
