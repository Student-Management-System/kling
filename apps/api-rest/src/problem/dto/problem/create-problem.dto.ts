import { OmitType } from "@nestjs/swagger";
import { ProblemDto } from "./problem.dto";

export class ProblemCreateDto extends OmitType(ProblemDto, [
	"submissions",
	"creationDate",
	"creator",
	"creatorId"
]) {}
