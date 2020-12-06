import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { AuthEffects } from "./auth-store/auth.effects";
import * as fromAuth from "./auth-store/auth.reducer";
import * as fromDirectory from "./directory-store/directory.reducer";
import { FileEffects } from "./file-store/file.effects";
import * as fromFile from "./file-store/file.reducer";
import { FileTabEffects } from "./file-tabs-store/file-tab.effects";
import * as fromFileTab from "./file-tabs-store/file-tab.reducer";
import { WorkspaceEffects } from "./workspace-store/workspace.effects";
import * as fromWorkspace from "./workspace-store/workspace.reducer";

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		StoreModule.forRoot(
			{},
			{
				runtimeChecks: {
					strictStateImmutability: true,
					strictActionImmutability: true,
					strictStateSerializability: true,
					strictActionSerializability: true,
					strictActionTypeUniqueness: true,
					strictActionWithinNgZone: false
				}
			}
		),
		EffectsModule.forRoot([]),
		EffectsModule.forFeature([AuthEffects, FileEffects, FileTabEffects, WorkspaceEffects]),
		StoreModule.forFeature(fromAuth.authFeatureKey, fromAuth.reducer),
		StoreModule.forFeature(fromWorkspace.workspaceFeatureKey, fromWorkspace.reducer),
		StoreModule.forFeature(fromDirectory.directoriesFeatureKey, fromDirectory.reducer),
		StoreModule.forFeature(fromFile.filesFeatureKey, fromFile.reducer),
		StoreModule.forFeature(fromFileTab.fileTabFeatureKey, fromFileTab.reducer)
	]
})
export class RootStoreModule {}
