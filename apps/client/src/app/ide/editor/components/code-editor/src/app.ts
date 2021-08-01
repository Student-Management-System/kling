import type { LanguageId } from "./register";
import type { ScopeName, TextMateGrammar, ScopeNameInfo } from "./providers";

// Recall we are using MonacoWebpackPlugin. According to the
// monaco-editor-webpack-plugin docs, we must use:
//
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
//
// instead of
//
// import * as monaco from 'monaco-editor';
//
// because we are shipping only a subset of the languages.
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "monaco-editor/esm/vs/language/typescript/monaco.contribution.js";
import { createOnigScanner, createOnigString, loadWASM } from "vscode-oniguruma";
import { SimpleLanguageInfoProvider } from "./providers";
import { registerLanguages } from "./register";
import { rehydrateRegexps } from "./configuration";
import VsCodeDarkTheme from "./vs-dark-plus-theme";

interface DemoScopeNameInfo extends ScopeNameInfo {
	path: string;
}

export async function main(language: LanguageId): Promise<monaco.editor.IStandaloneCodeEditor> {
	// In this demo, the following values are hardcoded to support Python using
	// the VS Code Dark+ theme. Currently, end users are responsible for
	// extracting the data from the relevant VS Code extensions themselves to
	// leverage other TextMate grammars or themes. Scripts may be provided to
	// facilitate this in the future.
	//
	// Note that adding a new TextMate grammar entails the following:
	// - adding an entry in the languages array
	// - adding an entry in the grammars map
	// - making the TextMate file available in the grammars/ folder
	// - making the monaco.languages.LanguageConfiguration available in the
	//   configurations/ folder.
	//
	// You likely also want to add an entry in getSampleCodeForLanguage() and
	// change the call to main() above to pass your LanguageId.
	const languages: monaco.languages.ILanguageExtensionPoint[] = [
		{
			id: "python",
			extensions: [".py"],
			aliases: ["Python", "py"],
			filenames: ["Snakefile", "BUILD", "BUCK", "TARGETS"],
			firstLine: "^#!\\s*/?.*\\bpython[0-9.-]*\\b"
		},
		{
			id: "java",
			extensions: [".java"],
			aliases: ["java"]
		},
		{
			id: "typescript",
			extensions: [".ts"],
			aliases: ["typescript", "ts"]
		}
	];
	const grammars: { [scopeName: string]: DemoScopeNameInfo } = {
		"source.python": {
			language: "python",
			path: "MagicPython.tmLanguage.json"
		},
		"source.java": {
			language: "java",
			path: "java.tmLanguage.json"
		},
		"source.typescript": {
			language: "typescript",
			path: "TypeScript.tmLanguage.json"
		}
	};

	const fetchGrammar = async (scopeName: ScopeName): Promise<TextMateGrammar> => {
		const { path } = grammars[scopeName];
		const uri = `/grammars/${path}`;
		const response = await fetch(uri);
		const grammar = await response.text();
		const type = path.endsWith(".json") ? "json" : "plist";
		return { type, grammar };
	};

	const fetchConfiguration = async (
		language: LanguageId
	): Promise<monaco.languages.LanguageConfiguration> => {
		const uri = `/configurations/${language}.json`;
		const response = await fetch(uri);
		const rawConfiguration = await response.text();
		return rehydrateRegexps(rawConfiguration);
	};

	const data: ArrayBuffer | Response = await loadVSCodeOnigurumWASM();
	loadWASM(data);
	const onigLib = Promise.resolve({
		createOnigScanner,
		createOnigString
	});

	const provider = new SimpleLanguageInfoProvider({
		grammars,
		fetchGrammar,
		configurations: languages.map(language => language.id),
		fetchConfiguration,
		theme: VsCodeDarkTheme,
		onigLib,
		monaco
	});
	registerLanguages(
		languages,
		(language: LanguageId) => provider.fetchLanguageInfo(language),
		monaco
	);

	const value = getSampleCodeForLanguage(language);
	const id = "editor";
	const element = document.getElementById("editor");
	if (element == null) {
		throw Error(`could not find element #${id}`);
	}

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	self.MonacoEnvironment = {
		getWorkerUrl: function (moduleId: any, label: any) {
			if (label === "json") {
				return "./workers/json.worker.bundle.js";
			}
			if (label === "css" || label === "scss" || label === "less") {
				return "./workers/css.worker.bundle.js";
			}
			if (label === "html" || label === "handlebars" || label === "razor") {
				return "./workers/html.worker.bundle.js";
			}
			if (label === "typescript" || label === "javascript") {
				return "./workers/ts.worker.bundle.js";
			}
			return "./workers/editor.worker.bundle.js";
		}
	};

	const editor = monaco.editor.create(element, {
		value,
		language,
		theme: "vs-dark",
		minimap: {
			enabled: false
		}
	});
	provider.injectCSS();

	return editor;
}

// Taken from https://github.com/microsoft/vscode/blob/829230a5a83768a3494ebbc61144e7cde9105c73/src/vs/workbench/services/textMate/browser/textMateService.ts#L33-L40
async function loadVSCodeOnigurumWASM(): Promise<Response | ArrayBuffer> {
	const response = await fetch("/node_modules/vscode-oniguruma/release/onig.wasm");
	const contentType = response.headers.get("content-type");
	if (contentType === "application/wasm") {
		return response;
	}

	// Using the response directly only works if the server sets the MIME type 'application/wasm'.
	// Otherwise, a TypeError is thrown when using the streaming compiler.
	// We therefore use the non-streaming compiler :(.
	return await response.arrayBuffer();
}

function getSampleCodeForLanguage(language: LanguageId): string {
	if (language === "python") {
		return `\
import foo

async def bar(): string:
  f = await foo()
  f_string = f"Hooray {f}! format strings are not supported in current Monarch grammar"
  return foo_string
`;
	}

	if (language === "java") {
		return `public class HelloWorld {

			public static void main(String[] args) {

				System.out.println("HelloWorld!");

			}

	  }`;
	}

	if (language === "typescript") {
		return `export class TypeScript {
	
			public main (args: string[]) {
	
				console.log("HelloWorld!");
	
			}
	
	  }`;
	}

	throw Error(`unsupported language: ${language}`);
}
