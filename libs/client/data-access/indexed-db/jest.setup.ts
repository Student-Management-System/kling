// https://stackoverflow.com/a/54134903
// Use in-memory indexed-db implementation
import Dexie from "dexie";
Dexie.dependencies.indexedDB = require("fake-indexeddb");
Dexie.dependencies.IDBKeyRange = require("fake-indexeddb/lib/FDBKeyRange");
