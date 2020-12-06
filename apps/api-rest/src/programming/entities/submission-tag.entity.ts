import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm";

@Entity()
export class SubmissionTag {
	@PrimaryColumn()
	name!: string;

	constructor(partial: Partial<SubmissionTag>) {
		Object.assign(this, partial);
	}
}
