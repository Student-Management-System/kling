import { SemesterPipe } from "./semester.pipe";

describe("SemesterPipe", () => {
	let semesterPipe: SemesterPipe;

	beforeEach(() => {
		semesterPipe = new SemesterPipe();
	});

	describe("Valid inputs", () => {
		it("wise1920 -> WiSe 19/20", () => {
			const result = semesterPipe.transform("wise1920");
			expect(result).toEqual("WiSe 19/20");
		});

		it("wise2021 -> WiSe 20/21", () => {
			const result = semesterPipe.transform("wise2021");
			expect(result).toEqual("WiSe 20/21");
		});

		it("sose2020 -> SoSe 2020", () => {
			const result = semesterPipe.transform("sose2020");
			expect(result).toEqual("SoSe 2020");
		});

		it("sose2021 -> SoSe 2021", () => {
			const result = semesterPipe.transform("sose2021");
			expect(result).toEqual("SoSe 2021");
		});
	});

	describe("Invalid inputs", () => {
		it("Correct syntax, but invalid characters -> ?", () => {
			const result = semesterPipe.transform("abcd1234");
			expect(result).toEqual("?");
		});

		it("Wrong syntax -> ?", () => {
			const result = semesterPipe.transform("ws1920");
			expect(result).toEqual("?");
		});

		it("Empty string -> Empty string", () => {
			const result = semesterPipe.transform("");
			expect(result).toEqual("");
		});

		it("null -> null", () => {
			const result = semesterPipe.transform(null as any as string);
			expect(result).toEqual(null);
		});
	});
});
