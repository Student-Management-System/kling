export * from "./authorization.service";
import { AuthorizationService } from "./authorization.service";
export * from "./category.service";
import { CategoryService } from "./category.service";
export * from "./default.service";
import { DefaultService } from "./default.service";
export * from "./problem.service";
import { ProblemService } from "./problem.service";
export const APIS = [AuthorizationService, CategoryService, DefaultService, ProblemService];
