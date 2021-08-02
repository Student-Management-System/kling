import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./shared/components/page-not-found/page-not-found.component";

const routes: Routes = [
	{ path: "404", component: PageNotFoundComponent, pathMatch: "full" },
	{ path: "", redirectTo: "/home", pathMatch: "full" },
	{ path: "playground", loadChildren: () => import("./ide/ide.module").then(m => m.IdeModule) },
	{
		path: "problems/:problemId",
		loadChildren: () => import("./ide/ide.module").then(m => m.IdeModule)
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
	}
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
