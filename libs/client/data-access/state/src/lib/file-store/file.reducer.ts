import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import * as FileActions from "./file.actions";
import { File } from "./file.model";

export const filesFeatureKey = "files";

export interface State extends EntityState<File> {
	// additional entity state properties
	selectedFilePath: string;
}

export const adapter: EntityAdapter<File> = createEntityAdapter<File>({
	selectId: file => file.path,
	sortComparer: (fileA, fileB) => fileA.path.localeCompare(fileB.path)
});

export const initialState: State = adapter.getInitialState({
	// additional entity state properties
	selectedFilePath: null
});

export const reducer = createReducer(
	initialState,
	on(FileActions.addFile, (state, action) => _addFile(action, state)),
	on(FileActions.addFiles, (state, action) => adapter.addMany(action.files, state)),
	on(FileActions.markAsChanged, (state, action) =>
		adapter.updateOne(
			{
				id: action.path,
				changes: {
					hasUnsavedChanges: true
				}
			},
			state
		)
	),
	on(FileActions.saveFile, (state, action) =>
		adapter.updateOne(
			{ id: action.path, changes: { content: action.content, hasUnsavedChanges: false } },
			state
		)
	),
	on(FileActions.deleteFile, (state, action) =>
		adapter.removeOne(action.file.path, {
			...state,
			selectedPath:
				action.file.path !== state.selectedFilePath ? state.selectedFilePath : null
		})
	),
	on(FileActions.clearFiles, state => adapter.removeAll(state)),
	on(
		FileActions.setSelectedFile,
		FileActions.setSelectedFile_FileTabRemoved,
		(state, action) => ({ ...state, selectedFilePath: action.file?.path })
	)
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();

function _addFile(action: { file: File }, state: State): State {
	return adapter.addOne(action.file, state);
}
