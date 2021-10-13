import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
	{
		path: "problems/:problemId",
		loadChildren: () => import("@kling/ide").then(m => m.IdeModule)
	},
	{
		path: "problem-editor",
		loadChildren: () =>
			import("./problem-editor/problem-editor.module").then(m => m.ProblemEditorModule)
	},
	{
		path: "problems",
		loadChildren: () =>
			import("./problem-list/problem-list.module").then(m => m.ProblemListModule)
	},
	{ path: "ide", loadChildren: () => import("@kling/ide").then(m => m.IdeModule) }
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			paramsInheritanceStrategy: "always",
			relativeLinkResolution: "legacy"
		})
	],
	exports: [RouterModule]
})
export class AppRoutingModule {}
