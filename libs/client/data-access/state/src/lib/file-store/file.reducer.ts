import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import * as FileActions from "./file.actions";
import { File } from "@web-ide/programming";

export const filesFeatureKey = "files";

export interface State extends EntityState<File> {
	// additional entity state properties
	selectedFilePath: string | null;
	previouslySelectedFilePath: string | null;
}

export const adapter: EntityAdapter<File> = createEntityAdapter<File>({
	selectId: file => file.path,
	sortComparer: (fileA, fileB) => fileA.path.localeCompare(fileB.path)
});

export const initialState: State = adapter.getInitialState({
	// additional entity state properties
	selectedFilePath: null,
	previouslySelectedFilePath: null
});

export const reducer = createReducer(
	initialState,
	on(FileActions.addFile, (state, action) => adapter.addOne(action.file, state)),
	on(FileActions.addFiles, (_state, action) => adapter.addMany(action.files, initialState)),
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
	on(FileActions.fileSaved, (state, action) =>
		adapter.updateOne(
			{ id: action.path, changes: { content: action.content, hasUnsavedChanges: false } },
			state
		)
	),
	on(FileActions.deleteFile, (state, action) =>
		adapter.removeOne(action.file.path, {
			...state,
			previouslySelectedFilePath:
				action.file.path !== state.previouslySelectedFilePath
					? state.previouslySelectedFilePath
					: null,
			selectedFilePath:
				action.file.path !== state.selectedFilePath ? state.selectedFilePath : null
		})
	),
	on(FileActions.clearFiles, () => initialState),
	on(FileActions.setSelectedFile, (state, action) => ({
		...state,
		previouslySelectedFilePath: state.selectedFilePath,
		selectedFilePath: action.path
	}))
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
