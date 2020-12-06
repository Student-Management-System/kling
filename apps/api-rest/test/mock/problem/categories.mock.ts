import { Category } from "../../../src/problem/entities/category.entity";

export const CATEGORIES_STRINGS = [
	"Array",
	"Condition",
	"Exception",
	"Loop",
	"Map",
	"Math",
	"Object-Oriented",
	"Polymorphism",
	"Recursion",
	"Stack"
];
export const CATEGORIES: Category[] = CATEGORIES_STRINGS.map(
	(name, id) => new Category({ id, name })
);
