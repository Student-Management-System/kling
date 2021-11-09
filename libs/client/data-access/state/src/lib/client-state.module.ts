import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { DirectoryEffects } from "./directory-store/directory.effects";
import * as fromDirectory from "./directory-store/directory.reducer";
import { FileEffects } from "./file-store/file.effects";
import * as fromFile from "./file-store/file.reducer";
import { FileTabEffects } from "./file-tabs-store/file-tab.effects";
import * as fromFileTab from "./file-tabs-store/file-tab.reducer";
import { StudentMgmtEffects } from "./student-mgmt-store/student-mgmt.effects";
import * as fromStudentMgmt from "./student-mgmt-store/student-mgmt.reducer";
import { WorkspaceEffects } from "./workspace-store/workspace.effects";
import * as fromWorkspace from "./workspace-store/workspace.reducer";

@NgModule({
	imports: [
		StoreModule.forRoot(
			{},
			{
				runtimeChecks: {
					strictStateImmutability: true,
					strictActionImmutability: true,
					strictStateSerializability: false,
					strictActionSerializability: false,
					strictActionTypeUniqueness: true,
					strictActionWithinNgZone: false
				}
			}
		),
		EffectsModule.forRoot([]),
		EffectsModule.forFeature([
			DirectoryEffects,
			FileEffects,
			FileTabEffects,
			WorkspaceEffects,
			StudentMgmtEffects
		]),
		StoreModule.forFeature(fromWorkspace.workspaceFeatureKey, fromWorkspace.reducer),
		StoreModule.forFeature(fromDirectory.directoriesFeatureKey, fromDirectory.reducer),
		StoreModule.forFeature(fromFile.filesFeatureKey, fromFile.reducer),
		StoreModule.forFeature(fromFileTab.fileTabFeatureKey, fromFileTab.reducer),
		StoreModule.forFeature(fromStudentMgmt.studentMgmtFeatureKey, fromStudentMgmt.reducer)
	]
})
export class ClientStateModule {}
