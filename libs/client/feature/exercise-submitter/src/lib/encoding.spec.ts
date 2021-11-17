import { FileDto } from "@student-mgmt/exercise-submitter-api-client";
import { fromBase64, toFileModel, toBase64 } from "./encoding";
describe("Encoding", () => {
	const plainStr = "Hello world! ä ö ü ß";
	const encodedStr = "SGVsbG8gd29ybGQhIMOkIMO2IMO8IMOf";

	describe("Encode", () => {
		it("Encodes a plain string in base64", () => {
			const encoded = toBase64(plainStr);
			expect(encoded).toEqual(encodedStr);
		});
	});
	describe("Decode", () => {
		it("Decodes a base64 string", () => {
			const decoded = fromBase64(encodedStr);
			expect(decoded).toEqual(plainStr);
		});
	});

	describe("toFileModel", () => {
		it("Maps simple encoded file to internal model", () => {
			const encodedContent = encodedStr;
			const originalContent = plainStr;

			const encodedFile: FileDto = {
				path: "Main.java",
				content: encodedContent
			};

			const result = toFileModel(encodedFile);
			expect(result.path).toEqual(encodedFile.path);
			expect(result.name).toEqual(encodedFile.path);
			expect(result.content).toEqual(originalContent);
		});

		it("Maps nested encoded file to internal model", () => {
			const encodedContent = encodedStr;
			const originalContent = plainStr;

			const directoryPath = "src/subfolder";
			const filename = "Main.java";

			const encodedFile: FileDto = {
				path: `${directoryPath}/${filename}`,
				content: encodedContent
			};

			const result = toFileModel(encodedFile);
			expect(result.path).toEqual(encodedFile.path);
			expect(result.name).toEqual(filename);
			expect(result.directoryPath).toEqual(directoryPath);
			expect(result.content).toEqual(originalContent);
		});
	});
});
