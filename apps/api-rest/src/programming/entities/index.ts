import { SolutionDao } from "./solution.entity";
import { Submission } from "./submission.entity";
import { SubmissionTag } from "./submission-tag.entity";
import { TestCase } from "./test-case.entity";
import { FailedTestCase } from "./test-case-result.entity";

export const Entities = [SolutionDao, Submission, SubmissionTag, TestCase, FailedTestCase];
