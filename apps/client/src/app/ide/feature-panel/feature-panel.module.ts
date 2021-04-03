import { NgModule } from "@angular/core";
import { NgTerminalModule } from "ng-terminal";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { MarkdownModule } from "ngx-markdown";
import { SharedModule } from "../../shared/shared.module";
import { CollaborationModule } from "./collaboration/collaboration.module";
import { FeaturePanelComponent } from "./components/feature-panel/feature-panel.component";
import { ProblemViewComponent } from "./components/problem-view/problem-view.component";
import { TerminalComponent } from "./components/terminal/terminal.component";
import { TestingViewComponent } from "./components/testing-view/testing-view.component";
import { TerminalFacade } from "./services/terminal.facade";

@NgModule({
	declarations: [
		FeaturePanelComponent,
		ProblemViewComponent,
		TerminalComponent,
		TestingViewComponent
	],
	imports: [
		SharedModule,
		PdfViewerModule,
		MarkdownModule.forChild(),
		NgTerminalModule,
		CollaborationModule
	],
	exports: [FeaturePanelComponent],
	providers: [TerminalFacade]
})
export class FeaturePanelModule {}
