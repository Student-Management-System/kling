import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { CodeEditorComponent } from "./components/code-editor/code-editor.component";
import { DiffEditorDialog } from "./components/code-editor/diff-editor.dialog";
import { FileTabsComponent } from "./components/file-tabs/file-tabs.component";
import { RunCodeComponent } from "./components/run-code/run-code.component";
import { WelcomeComponent } from "./components/welcome/welcome.component";

@NgModule({
	declarations: [
		CodeEditorComponent,
		DiffEditorDialog,
		FileTabsComponent,
		RunCodeComponent,
		WelcomeComponent
	],
	imports: [SharedModule],
	providers: [],
	exports: [
		CodeEditorComponent,
		CodeEditorComponent,
		FileTabsComponent,
		RunCodeComponent,
		WelcomeComponent
	]
})
export class EditorModule {}
