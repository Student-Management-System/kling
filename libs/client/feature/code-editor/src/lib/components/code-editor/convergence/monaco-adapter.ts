/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ColorAssigner } from "@convergence/color-assigner";
import * as monaco from "monaco-editor";
import {
	EditorContentManager,
	RemoteCursorManager,
	RemoteSelectionManager
} from "@convergencelabs/monaco-collab-ext";
import {
	LocalIndexReference,
	LocalRangeReference,
	ModelReference,
	RealTimeString
} from "@convergence/convergence";

export class MonacoConvergenceAdapter {
	private monacoEditor: monaco.editor.IStandaloneCodeEditor;
	private textModel: monaco.editor.ITextModel;
	private content: RealTimeString;
	private colorAssigner!: ColorAssigner;
	private contentManager!: EditorContentManager;
	private remoteCursorManager!: RemoteCursorManager;
	private remoteSelectionManager!: RemoteSelectionManager;
	private selectionReference!: LocalRangeReference;
	private cursorReference!: LocalIndexReference;

	constructor(
		monacoEditor: monaco.editor.IStandaloneCodeEditor,
		textModel: monaco.editor.ITextModel,
		realtimeString: RealTimeString
	) {
		this.monacoEditor = monacoEditor;
		this.textModel = textModel;
		this.content = realtimeString;
		this.colorAssigner = new ColorAssigner();

		this.initSharedData();
		this.initSharedCursors();
		this.initSharedSelection();
	}

	private initSharedData(): void {
		this.contentManager = new EditorContentManager({
			editor: this.monacoEditor,
			onInsert: (index, text) => {
				this.content.insert(index, text);
			},
			onReplace: (index, length, text) => {
				this.content.model().startBatch();
				this.content.remove(index, length);
				this.content.insert(index, text);
				this.content.model().completeBatch();
			},
			onDelete: (index, length) => {
				this.content.remove(index, length);
			},
			remoteSourceId: "convergence"
		});

		this.content.events().subscribe(e => {
			switch (e.name) {
				case "insert":
					this.contentManager.insert((e as any).index, (e as any).value);
					break;
				case "remove":
					this.contentManager.delete((e as any).index, (e as any).value.length);
					break;
				default:
			}
		});
	}

	private initSharedCursors(): void {
		this.remoteCursorManager = new RemoteCursorManager({
			editor: this.monacoEditor,
			tooltips: true,
			tooltipDuration: 2
		});
		this.cursorReference = this.content.indexReference("cursor");

		const references = this.content.references({ key: "cursor" });
		references.forEach(reference => {
			if (!reference.isLocal()) {
				this.addRemoteCursor(reference);
			}
		});

		this.setLocalCursor();
		this.cursorReference.share();

		this.monacoEditor.onDidChangeCursorPosition(e => {
			this.setLocalCursor();
		});

		this.content.on("reference", e => {
			if ((e as any).reference.key() === "cursor") {
				this.addRemoteCursor((e as any).reference);
			}
		});
	}

	private setLocalCursor(): void {
		const position = this.monacoEditor.getPosition();

		if (position) {
			const offset = this.textModel.getOffsetAt(position);
			this.cursorReference.set(offset);
		} else {
			this.cursorReference.set(-1);
		}
	}

	private addRemoteCursor(reference: ModelReference): void {
		const color = this.colorAssigner.getColorAsHex(reference.sessionId());
		const remoteCursor = this.remoteCursorManager.addCursor(
			reference.sessionId(),
			color,
			reference.user().displayName
		);

		reference.on("cleared", () => remoteCursor.hide());
		reference.on("disposed", () => remoteCursor.dispose());
		reference.on("set", () => {
			const cursorIndex = reference.value();
			remoteCursor.setOffset(cursorIndex);
		});
	}

	private initSharedSelection(): void {
		this.remoteSelectionManager = new RemoteSelectionManager({
			editor: this.monacoEditor
		});

		this.selectionReference = this.content.rangeReference("selection");
		this.setLocalSelection();
		this.selectionReference.share();

		this.monacoEditor.onDidChangeCursorSelection(e => {
			this.setLocalSelection();
		});

		const references = this.content.references({ key: "selection" });
		references.forEach(reference => {
			if (!reference.isLocal()) {
				this.addRemoteSelection(reference);
			}
		});

		this.content.on("reference", e => {
			if ((e as any).reference.key() === "selection") {
				this.addRemoteSelection((e as any).reference);
			}
		});
	}

	private setLocalSelection(): void {
		const selection = this.monacoEditor.getSelection();
		if (selection && !selection!.isEmpty()) {
			const start = this.textModel.getOffsetAt(selection!.getStartPosition());
			const end = this.textModel.getOffsetAt(selection!.getEndPosition());
			this.selectionReference.set({ start, end });
		} else if (this.selectionReference.isSet()) {
			this.selectionReference.clear();
		}
	}

	private addRemoteSelection(reference: ModelReference): void {
		const color = this.colorAssigner.getColorAsHex(reference.sessionId());
		const remoteSelection = this.remoteSelectionManager.addSelection(
			reference.sessionId(),
			color
		);

		if (reference.isSet()) {
			const selection = reference.value();
			remoteSelection.setOffsets(selection.start, selection.end);
		}

		reference.on("cleared", () => remoteSelection.hide());
		reference.on("disposed", () => remoteSelection.dispose());
		reference.on("set", () => {
			const selection = reference.value();
			remoteSelection.setOffsets(selection.start, selection.end);
		});
	}
}
