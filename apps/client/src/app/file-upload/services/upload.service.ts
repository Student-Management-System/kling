import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class UploadService {
	constructor(private http: HttpClient) {}

	readFileContent(file: File): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			if (!file) {
				resolve("");
			}

			const reader = new FileReader();

			reader.onload = e => {
				const text = reader.result.toString();
				resolve(text);
			};

			reader.readAsText(file);
		});
	}
}
