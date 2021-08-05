import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ProblemDto, ProblemService } from "@kling/shared/data-access/api-rest-ng-client";
import { Subject, BehaviorSubject } from "rxjs";
import { debounceTime, skip } from "rxjs/operators";
import { UnsubscribeOnDestroy } from "../../shared/components/unsubscribe-on-destroy.component";
import { Paginator } from "../../shared/paginator/paginator.component";

class ProblemFilter {
	title?: string;
	difficulties?: ProblemDto.DifficultyEnum[];
	categories?: string[];
	status?: ProblemDto.StatusEnum;
}

@Component({
	selector: "app-problem-list",
	templateUrl: "./problem-list.component.html",
	styleUrls: ["./problem-list.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProblemListComponent extends UnsubscribeOnDestroy implements OnInit {
	dataSource$ = new BehaviorSubject(new MatTableDataSource<ProblemDto>([]));

	filter = new ProblemFilter();
	filterSubject = new Subject();
	titleFilterChangedSubject = new Subject();

	difficultyEnum = ProblemDto.DifficultyEnum;
	statusEnum = ProblemDto.StatusEnum;

	displayedColumns = ["creationDate", "status", "title", "difficulty", "categories", "spacer"];
	@ViewChild(Paginator, { static: true }) paginator: Paginator;

	constructor(private problemService: ProblemService) {
		super();
	}

	ngOnInit(): void {
		this.loadProblems();

		this.subs.sink = this.titleFilterChangedSubject
			.pipe(debounceTime(300))
			.subscribe(() => this.filterSubject.next(null));

		this.subs.sink = this.filterSubject.pipe(skip(1)).subscribe(() => this.loadProblems());
	}

	loadProblems(triggeredByPaginator = false): void {
		const [skip, take] = this.paginator.getSkipAndTake();

		const title = this.filter.title?.length > 0 ? this.filter.title : undefined;
		const difficulties =
			this.filter.difficulties?.length > 0 ? this.filter.difficulties : undefined;
		const categories = this.filter.categories?.length > 0 ? this.filter.categories : undefined;

		this.subs.sink = this.problemService
			.findProblems(skip, take, title, difficulties, categories, status, "response")
			.subscribe(response => {
				this.paginator.setTotalCountFromHttp(response);
				this.dataSource$.next(new MatTableDataSource(response.body));
			});
	}
}
