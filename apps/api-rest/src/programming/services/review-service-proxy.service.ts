import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { EvaluationResult } from "../dto/evaluation.dto";
import { FailedTestCaseDto } from "../dto/failed-test-case.dto";
import { FileDto } from "../dto/file.dto";

export class RunCodeRequest {
	from: string;
	files: FileDto[];
	language: string;
}

export class ReviewServiceResponse {
	result!: EvaluationResult;
	failedTestCases?: FailedTestCaseDto[];
	errorMessage?: string;
	speedInMs?: number;
}

@Injectable()
export class ReviewServiceProxy {
	constructor(@Inject("REVIEW_SERVICE") private reviewService: ClientProxy) {}

	runCode(request: RunCodeRequest): Observable<ReviewServiceResponse> {
		return this.reviewService.send("RUN_CODE", request);
	}

	test(): Observable<number> {
		return this.reviewService.send("COUNT_TO_THREE", { kappa: "Grey Face (no space)" });
	}
}
