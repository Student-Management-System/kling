import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AuthService } from "@kling/client-auth";
import { environment } from "@kling/client-environments";
import { FileActions, StudentMgmtSelectors } from "@kling/client/data-access/state";
import { createMainFile, SupportedLanguage } from "@kling/programming";
import { Store } from "@ngrx/store";

@Component({
	selector: "kling-get-started",
	templateUrl: "./get-started.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GetStartedComponent {
	user$ = this.store.select(StudentMgmtSelectors.user);

	_isDevelopment = !environment.production;

	constructor(private readonly authService: AuthService, private readonly store: Store) {}

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
