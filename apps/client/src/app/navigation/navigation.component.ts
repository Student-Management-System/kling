import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { OverlayContainer } from "@angular/cdk/overlay";
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	OnInit,
	Output,
	ViewChild
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSidenav } from "@angular/material/sidenav";
import { NavigationEnd, Router } from "@angular/router";
import { combineLatest, Observable } from "rxjs";
import { filter, map, shareReplay, withLatestFrom } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { SidenavService } from "../shared/services/sidenav.service";
import { SnackbarService } from "../shared/services/snackbar.service";
import { ThemeService } from "../shared/services/theme.service";
import { TitlebarService } from "../shared/services/titlebar.service";

@Component({
	selector: "app-navigation",
	templateUrl: "./navigation.component.html",
	styleUrls: ["./navigation.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnInit {
	@Output() onLanguageChange = new EventEmitter<string>();

	@ViewChild("drawer", { static: true }) drawer: MatSidenav;

	isHandset$: Observable<boolean> = combineLatest([
		this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.Handset]),
		this.sidenav.forceOverlayMode$
	]).pipe(
		map(([breakpoints, overlayMode]) => overlayMode || breakpoints.matches),
		shareReplay()
	);

	showTitlebar: boolean;

	isDevelopment = !environment.production;

	constructor(
		private breakpointObserver: BreakpointObserver,
		private sidenav: SidenavService,
		private titlebar: TitlebarService,
		public theme: ThemeService,
		private router: Router,
		private dialog: MatDialog,
		private overlayContainer: OverlayContainer,
		public snackbar: SnackbarService
	) {}

	ngOnInit(): void {
		this.subscribeToCloseSidenavOnNavigationWhenInHandsetMode();

		this.sidenav.toggle$.subscribe(shouldOpen => {
			if (shouldOpen) {
				this.drawer.open();
			} else {
				this.drawer.close();
			}
		});

		this.titlebar.toggle$.subscribe(shouldBeVisible => {
			if (shouldBeVisible) {
				this.showTitlebar = true;
			} else {
				this.showTitlebar = false;
			}
		});

		this.theme.theme$.subscribe(theme => this.onThemeChange(theme));
	}

	setLanguage(lang: string): void {
		this.onLanguageChange.emit(lang);
	}

	/**
	 * When `isHandset$` is true and the user clicks on a navigation link inside the sidenav,
	 * the sidenav will be closed.
	 */
	private subscribeToCloseSidenavOnNavigationWhenInHandsetMode() {
		this.router.events
			.pipe(
				withLatestFrom(this.isHandset$),
				filter(([a, b]) => b && a instanceof NavigationEnd)
			)
			.subscribe(x => this.drawer.close());
	}

	private onThemeChange(theme: string): void {
		const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
		const themeClassesToRemove = Array.from(overlayContainerClasses).filter((item: string) =>
			item.includes("-theme")
		);
		if (themeClassesToRemove.length) {
			overlayContainerClasses.remove(...themeClassesToRemove);
		}
		overlayContainerClasses.add(theme);
	}
}
