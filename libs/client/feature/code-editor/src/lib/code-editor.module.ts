import { NgModule } from "@angular/core";
import { SharedModule } from "@kling/client-shared";
import { CodeEditorComponent } from "./components/code-editor/code-editor.component";
import { DiffEditorDialog } from "./components/code-editor/diff-editor.dialog";
import { RunCodeComponent } from "./components/run-code/run-code.component";

@NgModule({
	declarations: [CodeEditorComponent, DiffEditorDialog, RunCodeComponent],
	imports: [SharedModule],
	exports: [CodeEditorComponent, RunCodeComponent]
})
export class CodeEditorModule {}
