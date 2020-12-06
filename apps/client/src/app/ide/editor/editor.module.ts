import { NgModule } from "@angular/core";
import { MonacoEditorModule } from "ngx-monaco-editor";
import { SharedModule } from "../../shared/shared.module";
import { CodeEditorComponent } from "./components/code-editor/code-editor.component";
import { FileTabsComponent } from "./components/file-tabs/file-tabs.component";
import { RunCodeComponent } from "./components/run-code/run-code.component";

@NgModule({
	declarations: [CodeEditorComponent, FileTabsComponent, RunCodeComponent],
	imports: [SharedModule, MonacoEditorModule],
	providers: [],
	exports: [CodeEditorComponent, FileTabsComponent, RunCodeComponent]
})
export class EditorModule {}
