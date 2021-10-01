/// <reference types="wicg-file-system-access" />

type BaseProject = {
	readonly name: string;
	readonly lastOpened: Date;
	readonly source: string;
};

export type InMemoryProject = BaseProject & {
	readonly source: "in-memory";
};

export type FsProject = BaseProject & {
	readonly source: "fs";
	readonly directoryHandle?: FileSystemDirectoryHandle;
};

export type StoredProject = InMemoryProject | FsProject;
