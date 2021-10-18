import { NgModule } from "@angular/core";
import { SharedModule } from "@kling/client-shared";
import { MarkdownModule } from "ngx-markdown";
import { FeaturePanelComponent } from "./components/feature-panel/feature-panel.component";
import { ProblemViewComponent } from "./components/problem-view/problem-view.component";
import { TerminalModule } from "./components/terminal/terminal.module";
import { TestingViewComponent } from "./components/testing-view/testing-view.component";
import { TerminalService } from "./services/terminal.service";
import { CollaborationModule } from "@kling/collaboration";

@NgModule({
	declarations: [FeaturePanelComponent, ProblemViewComponent, TestingViewComponent],
	imports: [SharedModule, MarkdownModule.forChild(), TerminalModule, CollaborationModule],
	exports: [FeaturePanelComponent],
	providers: [TerminalService]
})
export class FeaturePanelModule {}
