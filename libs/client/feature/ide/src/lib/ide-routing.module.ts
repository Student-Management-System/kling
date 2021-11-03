import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WorkspaceComponent } from "./workspace/workspace.component";

const routes: Routes = [
	{
		path: "",
		component: WorkspaceComponent,
		pathMatch: "full",
		children: [
			{
				outlet: "es-outlet",
				path: "",
				loadChildren: () =>
					import("@kling/exercise-submitter").then(m => m.ExerciseSubmitterModule)
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class IdeRoutingModule {}
