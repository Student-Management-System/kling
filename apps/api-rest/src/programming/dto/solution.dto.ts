import { DirectoryDto } from "./directory.dto";
import { ArrayNotEmpty, IsNotEmpty } from "class-validator";
import { FileDto } from "./file.dto";
import { UserId } from "../../user/entities/user.entity";

export class SolutionDto {
	id?: number;
	name?: string;
	userId: UserId;
	@ArrayNotEmpty()
	files!: FileDto[];
	@IsNotEmpty()
	language!: string;
}
