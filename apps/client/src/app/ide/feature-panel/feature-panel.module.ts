import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";
import { FeaturePanelComponent } from "./components/feature-panel/feature-panel.component";
import { ProblemViewComponent } from "./components/problem-view/problem-view.component";
import { TerminalComponent } from "./components/terminal/terminal.component";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { MarkdownModule } from "ngx-markdown";
import { NgTerminalModule } from "ng-terminal";
import { CollaborationModule } from "./collaboration/collaboration.module";
import { TerminalFacade } from "./services/terminal.facade";

@NgModule({
	declarations: [FeaturePanelComponent, ProblemViewComponent, TerminalComponent],
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
