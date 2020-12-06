import { IsDefined, IsNotEmpty } from "class-validator";

export class FileDto {
	/** The full path of this file. Includes the file name. */
	@IsNotEmpty()
	path!: string;
	/** Path to the directory that contains this file. */
	@IsNotEmpty()
	directoryPath!: string;
	/** Name of the file (includes file extension). */
	@IsNotEmpty()
	name!: string;
	/** Content of the file.*/
	@IsDefined()
	content!: string;
}
