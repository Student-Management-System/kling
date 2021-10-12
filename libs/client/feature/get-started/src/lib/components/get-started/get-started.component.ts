import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "@kling/client-auth";
import { AuthSelectors, FileActions } from "@kling/client/data-access/state";
import { createMainFile, SupportedLanguage } from "@kling/programming";
import { Store } from "@ngrx/store";
import { environment } from "apps/client/src/environments/environment";
import { LoginDialogComponent } from "libs/client/feature/auth/src/lib/dialogs/login/login.dialog";

@Component({
	selector: "kling-get-started",
	templateUrl: "./get-started.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GetStartedComponent {
	user$ = this.store.select(AuthSelectors.selectUser);

	_isDevelopment = !environment.production;

	constructor(
		private readonly dialog: MatDialog,
		private readonly authService: AuthService,
		private readonly store: Store
	) {}

	openLoginDialog(): void {
		this.dialog.open(LoginDialogComponent);
	}

	logout(): void {
		this.authService.logout();
	}

	createMainFile(language: SupportedLanguage): void {
		const file = createMainFile(language);
		this.store.dispatch(FileActions.addFile({ file }));
		this.store.dispatch(FileActions.setSelectedFile({ path: file.path }));
	}

	_devLogin(username: string): void {
		this.authService.devLogin(username).subscribe({
			next: user => {
				console.log("Logged in as: " + user);
			},
			error: error => {
				console.log(error);
			}
		});
	}
}
