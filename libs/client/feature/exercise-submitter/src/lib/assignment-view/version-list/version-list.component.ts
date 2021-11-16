import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	NgModule,
	Output
} from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateModule } from "@ngx-translate/core";
import { VersionDto } from "@student-mgmt/exercise-submitter-api-client";
import { IconModule, UnsubscribeOnDestroy } from "@web-ide/client/shared/components";
import { debounceTime, Subject } from "rxjs";

export type VersionWithDate = VersionDto & {
	date: Date;
};

@Component({
	selector: "web-ide-version-list",
	templateUrl: "./version-list.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class VersionListComponent extends UnsubscribeOnDestroy {
	@Input() versions!: VersionWithDate[];
	@Input() isLoading!: boolean;
	@Output() loadVersionsClicked = new EventEmitter<void>();
	@Output() compareVersion = new EventEmitter<VersionWithDate>();
	@Output() replayVersion = new EventEmitter<VersionWithDate>();

	_refreshDebounce$ = new Subject<void>();

	constructor() {
		super();
		this.subs.sink = this._refreshDebounce$
			.pipe(debounceTime(1000)) // Ensure Button cannot be spammed
			.subscribe(() => this.loadVersionsClicked.next());
	}
}

@NgModule({
	declarations: [VersionListComponent],
	exports: [VersionListComponent],
	imports: [CommonModule, MatProgressSpinnerModule, MatTooltipModule, TranslateModule, IconModule]
})
export class VersionListModule {}
