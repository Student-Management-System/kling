import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UnsubscribeOnDestroy } from "@kling/client/shared/components";
import { ToastService } from "@kling/client/shared/services";
import {
	CategoryService,
	CodeTemplateDto,
	ProblemDto,
	ProblemService
} from "@kling/shared/data-access/api-rest-ng-client";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
	selector: "app-create-problem",
	templateUrl: "./create-problem.component.html",
	styleUrls: ["./create-problem.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateProblemComponent extends UnsubscribeOnDestroy implements OnInit {
	form: FormGroup;
	difficultyEnum = ProblemDto.DifficultyEnum;
	idAvailability$ = new Subject<"TRUE" | "FALSE" | "PENDING" | "UNKNOWN">();
	selectableCategories: string[];

	constructor(
		private problemService: ProblemService,
		private categoryService: CategoryService,
		private fb: FormBuilder,
		private toast: ToastService,
		private router: Router
	) {
		super();
		this.form = this.fb.group({
			id: ["", Validators.required],
			title: ["", Validators.required],
			difficulty: [ProblemDto.DifficultyEnum.EASY, Validators.required],
			categories: this.fb.array([]),
			codeTemplates: this.fb.array([])
		});
	}

	ngOnInit(): void {
		this.subscribeToIdAvailabilityCheck();
		this.loadCategories();

		this.form.patchValue({
			id: "test-problem",
			title: "Test-Problem"
		});
	}

	/**
	 * Performs an API request to check, if the selected `id` is available.
	 * Triggered 1000ms after user stopped typing.
	 * Result will be set in `isIdAvailable`.
	 */
	private subscribeToIdAvailabilityCheck(): void {
		this.subs.sink = this.form
			.get("id")
			.valueChanges.pipe(debounceTime(1000))
			.subscribe(value => {
				if (value?.length > 0) {
					this.idAvailability$.next("PENDING");
					this.subs.sink = this.problemService.getProblem(value).subscribe(
						_exists => this.idAvailability$.next("FALSE"),
						error => {
							if (error.status === 404) {
								this.idAvailability$.next("TRUE");
							} else {
								this.idAvailability$.next("UNKNOWN");
							}
						}
					);
				} else {
					this.idAvailability$.next("UNKNOWN");
				}
			});
	}

	/**
	 * Loads all available categories from the API.
	 * Result will be stored in `selectableCategories`.
	 */
	private loadCategories(): void {
		this.subs.sink = this.categoryService
			.findCategories()
			.subscribe(result => (this.selectableCategories = result));
	}

	onCreate(): void {
		const problem: ProblemDto = this.form.value;
		console.log(problem);
		this.problemService.createProblem(problem, problem.id).subscribe(
			created => {
				this.toast.success(created.title, "Message.Created");
				this.router.navigateByUrl("/problems");
			},
			error => {
				this.toast.apiError(error);
			}
		);
	}

	/**
	 * Returns the `categories` form array.
	 */
	getCategories(): FormArray {
		return this.form.get("categories") as FormArray;
	}

	addCategory(name?: string): void {
		this.getCategories().push(this.fb.control(name, [Validators.required]));
	}

	removeCategory(index: number): void {
		this.getCategories().removeAt(index);
	}

	/**
	 * Returns the `codeTemplates` form array.
	 */
	getCodeTemplates(): FormArray {
		return this.form.get("codeTemplates") as FormArray;
	}

	/**
	 * Adds a new code template to the form.
	 * @param [template] Partial `CodeTemplateDto`. Will be transformed to match the form's schema.
	 */
	addCodeTemplate(template?: Partial<CodeTemplateDto>): void {
		this.getCodeTemplates().push(
			this.fb.group({
				solution: ["", Validators.required],
				language: ["", Validators.required]
			})
		);
	}

	/**
	 * Removes the code template at the given index.
	 */
	removeCodeTemplate(index: number): void {
		this.getCodeTemplates().removeAt(index);
	}
}
