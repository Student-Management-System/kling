import { NgModule } from "@angular/core";
import { MarkdownModule } from "ngx-markdown";
import { SharedModule } from "../../shared/shared.module";
import { CollaborationModule } from "./collaboration/collaboration.module";
import { FeaturePanelComponent } from "./components/feature-panel/feature-panel.component";
import { ProblemViewComponent } from "./components/problem-view/problem-view.component";
import { TerminalComponent } from "./components/terminal/terminal.component";
import { TestingViewComponent } from "./components/testing-view/testing-view.component";
import { TerminalService } from "./services/terminal.service";

@NgModule({
	declarations: [
		FeaturePanelComponent,
		ProblemViewComponent,
		TerminalComponent,
		TestingViewComponent
	],
	imports: [SharedModule, MarkdownModule.forChild(), CollaborationModule],
	exports: [FeaturePanelComponent],
	providers: [TerminalService]
})
export class FeaturePanelModule {}
