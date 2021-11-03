import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthSelectors } from "@kling/client/data-access/state";
import { Store } from "@ngrx/store";
import { LoginDialogComponent } from "@kling/client-auth";

@Component({
	selector: "kling-exercise-submitter",
	templateUrl: "./exercise-submitter.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseSubmitterComponent {
	user$ = this.store.select(AuthSelectors.selectUser);

	constructor(private readonly store: Store, private readonly dialog: MatDialog) {}

	openLoginDialog(): void {
		this.dialog.open(LoginDialogComponent);
	}
}
