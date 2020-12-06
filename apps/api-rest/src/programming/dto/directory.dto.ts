import { FileDto } from "./file.dto";
import { IsNotEmpty } from "class-validator";

export class DirectoryDto {
	@IsNotEmpty()
	/** Name of this directory. */
	name!: string;
	/** Subdirectories. */
	directories!: DirectoryDto[];
	/** Files of this directory. */
	files!: FileDto[];
}
