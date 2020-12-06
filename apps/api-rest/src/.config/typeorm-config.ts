import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from "config";
import { Submission } from "../programming/entities/submission.entity";
import { CodeTemplate } from "../problem/entities/code-template.entity";
import { SolutionDao } from "../programming/entities/solution.entity";
import { Category } from "../problem/entities/category.entity";
import { ProblemDao } from "../problem/entities/problem-dao.entity";
import { User } from "../user/entities/user.entity";
import { Permission } from "../authorization/entities/permission.entity";
import { TestCase } from "../programming/entities/test-case.entity";
import { Evaluation } from "../programming/entities/evaluation.entity";
import { FailedTestCase } from "../programming/entities/test-case-result.entity";
import { SubmissionTag } from "../programming/entities/submission-tag.entity";

const dbConfig = config.get("db");
const loggingConfig = config.get("logger");

export const typeOrmConfig: TypeOrmModuleOptions = {
	type: process.env.DB_TYPE || (dbConfig as any).type,
	host: process.env.DB_HOST || (dbConfig as any).host,
	port: process.env.DB_PORT || (dbConfig as any).port,
	username: process.env.DB_USERNAME || (dbConfig as any).username,
	password: process.env.DB_PASSWORD || (dbConfig as any).password,
	database: process.env.DB_DATABASE || (dbConfig as any).database,
	synchronize: process.env.TYPEORM_SYNC || (dbConfig as any).synchronize,
	dropSchema: (dbConfig as any).dropSchema || false,
	keepConnectionAlive: true, // prevents AlreadyHasActiveConnectionError, needed for testing // TODO: Check if it should be disabled in production
	entities: [
		User,
		Permission,
		Submission,
		ProblemDao,
		CodeTemplate,
		SolutionDao,
		Category,
		TestCase,
		Evaluation,
		FailedTestCase,
		SubmissionTag
	],
	logging: (loggingConfig as any).dbErrors ? ["error"] : undefined
};
