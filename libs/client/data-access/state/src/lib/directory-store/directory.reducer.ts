import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import * as DirectoryActions from "./directory.actions";
import { createDirectory, Directory } from "./directory.model";

export const directoriesFeatureKey = "directories";

export type State = EntityState<Directory>;

export const adapter: EntityAdapter<Directory> = createEntityAdapter<Directory>({
	selectId: directory => directory.path,
	sortComparer: (dirA, dirB) => dirA.path.localeCompare(dirB.path)
});

export const initialState: State = adapter.getInitialState();

export const reducer = createReducer(
	initialState,
	on(DirectoryActions.addDirectory, (state, action) => adapter.addOne(action.directory, state)),
	on(DirectoryActions.upsertDirectory, (state, action) =>
		adapter.upsertOne(action.directory, state)
	),
	on(DirectoryActions.addDirectories, (state, action) =>
		adapter.addMany(action.directories, state)
	),
	on(DirectoryActions.upsertDirectories, (state, action) =>
		adapter.upsertMany(action.directories, state)
	),
	on(DirectoryActions.updateDirectory, (state, action) =>
		adapter.updateOne(action.directory, state)
	),
	on(DirectoryActions.updateDirectories, (state, action) =>
		adapter.updateMany(action.directories, state)
	),
	on(DirectoryActions.deleteDirectory, (state, action) =>
		adapter.removeOne(action.directory.path, state)
	),
	on(DirectoryActions.deleteDirectories, (state, action) =>
		adapter.removeMany(action.ids, state)
	),
	on(DirectoryActions.loadDirectories, (state, action) =>
		adapter.setAll(action.directories, state)
	),
	on(DirectoryActions.clearDirectories, (state): State => {
		const emptyState = adapter.removeAll(state);
		return adapter.addOne(createDirectory(""), emptyState); // Add root directory
	})
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
