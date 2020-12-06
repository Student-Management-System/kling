import {
	Controller,
	Get,
	Param,
	Put,
	Query,
	Req,
	BadRequestException,
	Delete,
	Header,
	ConflictException
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Request } from "express";
import { setTotalCountHeader } from "../../utils/http-utils";
import { CategoryFilter } from "../dto/category.filter";
import { CategoryRepository } from "../repositories/category.repository";

@ApiTags("category")
@Controller("categories")
export class CategoryController {
	constructor(private categoryRepo: CategoryRepository) {}

	@Put(":name")
	@ApiOperation({
		operationId: "createCategory",
		summary: "Create category.",
		description: "Creates a new category with the given name, if it does not exist already."
	})
	async createCategory(@Param("name") name: string): Promise<void> {
		const exists = await this.categoryRepo.findExact([name]);
		if (exists.length > 0) {
			throw new ConflictException(`Category ${name}  already exists.`);
		}
		await this.categoryRepo.create(name);
	}

	@Get()
	@ApiOperation({
		operationId: "findCategories",
		summary: "Find categories.",
		description: "Retrieves all categories that match the specified filter."
	})
	async findCategories(
		@Req() request: Request,
		@Query() filter?: CategoryFilter
	): Promise<string[]> {
		const [categories, count] = await this.categoryRepo.find(filter);
		setTotalCountHeader(request, count);
		return categories.map(c => c.name);
	}

	@Delete(":name")
	@ApiOperation({
		operationId: "removeCategory",
		summary: "Remove category.",
		description: "Removes the specified category."
	})
	async removeCategory(@Param("name") name: string): Promise<void> {
		const deleted = await this.categoryRepo.delete(name);
		if (!deleted) {
			throw new BadRequestException("Failed to delete category: " + name);
		}
	}
}
