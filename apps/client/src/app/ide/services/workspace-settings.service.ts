import { Injectable } from "@angular/core";
import { BehaviorSubject, ReplaySubject } from "rxjs";

export class WorkspaceLayout {
	explorerWidth: number;
	editorWidth: number;
	featurePanelWidth: number;
}

class WorkspaceLayoutStorage {
	current: LayoutName;
	custom: WorkspaceLayout;
}

type LayoutName = "default" | "custom";
type SideBarTab = "EXPLORER" | "HISTORY" | "HIDDEN";

@Injectable()
export class WorkspaceSettingsService {
	private sideBarComponentSubject = new BehaviorSubject<SideBarTab>("EXPLORER");
	sideBarComponent$ = this.sideBarComponentSubject.asObservable();

	private showFeaturePanelSubject = new BehaviorSubject<boolean>(true);
	showFeaturePanel$ = this.showFeaturePanelSubject.asObservable();

	private layoutSubject = new ReplaySubject<WorkspaceLayout>();
	layout$ = this.layoutSubject.asObservable();

	private readonly layoutStorageKey = "workspaceLayout";
	private layoutDefinitions = {
		default: {
			explorerWidth: 15,
			editorWidth: 55,
			featurePanelWidth: 30
		},
		custom: {
			explorerWidth: 15,
			editorWidth: 55,
			featurePanelWidth: 30
		}
	};

	constructor() {
		const storedLayout = this.getStoredLayoutOrDefault();

		if (storedLayout?.custom) {
			this.layoutDefinitions["custom"] = storedLayout.custom;
		}

		if (storedLayout?.current && storedLayout?.current !== "default") {
			this.setLayout(storedLayout.current);
		} else {
			this.layoutSubject.next(this.layoutDefinitions.default);
		}
	}

	/**
	 * Sets the layout to the given `layoutName`, if it exists.
	 * If a `customLayout` is provided, the custom layout will be updated with the new settings.
	 */
	setLayout(layoutName: LayoutName, customLayout?: WorkspaceLayout): void {
		const currentLayout = this.getStoredLayoutOrDefault();
		this.setStoredLayout({
			current: layoutName,
			custom: customLayout ?? currentLayout.custom
		});

		if (customLayout) {
			this.layoutDefinitions.custom = customLayout;
		}

		this.layoutSubject.next({ ...this.layoutDefinitions[layoutName] });
	}

	switchSideBarTabOrClose(nextTab: SideBarTab): void {
		const current = this.sideBarComponentSubject.getValue();

		// Close sidebar
		if (current === nextTab) {
			this.sideBarComponentSubject.next("HIDDEN");
		} else {
			// Open selected tab
			this.sideBarComponentSubject.next(nextTab);
		}
	}

	/**
	 * Emits `true` via `showFeaturePanel$`, if the feature panel should be opened
	 * or `false` if it should be closed.
	 */
	toggleFeaturePanel(): void {
		const isOpen = this.showFeaturePanelSubject.getValue();
		this.showFeaturePanelSubject.next(!isOpen);
	}

	/**
	 * Updates the custom layout in the `layoutDefinitions` as well as in `localstorage`.
	 */
	private updateCustomLayout(customLayout: WorkspaceLayout) {
		this.layoutDefinitions.custom = customLayout;
		const storedLayout = this.getStoredLayoutOrDefault();
		storedLayout.custom = customLayout;
		this.setStoredLayout(storedLayout);
	}

	/**
	 * Stores the given `layout` in `localstorage`.
	 */
	private setStoredLayout(layout: WorkspaceLayoutStorage): void {
		localStorage.setItem(this.layoutStorageKey, JSON.stringify(layout));
	}

	/**
	 * Retrieves the stored layout from `localstorage`.
	 * If the `localstorage` does not contain a information about the stored layout,
	 * the default settings will be returned.
	 */
	private getStoredLayoutOrDefault(): WorkspaceLayoutStorage {
		const stored = localStorage.getItem(this.layoutStorageKey);
		if (stored) {
			return JSON.parse(stored);
		}

		return {
			current: "default",
			custom: this.layoutDefinitions.custom
		};
	}
}
