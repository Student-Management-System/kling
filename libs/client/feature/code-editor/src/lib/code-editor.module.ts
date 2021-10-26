import { NgModule } from "@angular/core";
import { CodeEditorComponent } from "./components/code-editor/code-editor.component";
import { DiffEditorDialog } from "./components/code-editor/diff-editor.dialog";

@NgModule({
	declarations: [CodeEditorComponent, DiffEditorDialog],
	exports: [CodeEditorComponent]
})
export class CodeEditorModule {}
