import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ToDto } from "../../shared/interfaces/to-dto.interface";
import { SolutionDto } from "../dto/solution.dto";

@Entity()
export class SolutionDao implements ToDto<SolutionDto> {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ type: "json" })
	solution!: SolutionDto;

	constructor(partial?: Partial<SolutionDao>) {
		Object.assign(this, partial);
	}

	toDto(): SolutionDto {
		return {
			...this.solution,
			id: this.id
		};
	}
}
