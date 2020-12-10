import { LayoutModule } from "@angular/cdk/layout";
import { registerLocaleData } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import localeDe from "@angular/common/locales/de";
import localeDeExtra from "@angular/common/locales/extra/de";
import { InjectionToken, LOCALE_ID, NgModule, SecurityContext } from "@angular/core";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ApiModule, Configuration } from "@kling/shared/data-access/api-rest-ng-client";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { NgTerminalModule } from "ng-terminal";
import { ContextMenuModule } from "ngx-contextmenu";
import { MarkdownModule } from "ngx-markdown";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MonacoEditorModule, NgxMonacoEditorConfig } from "ngx-monaco-editor";
import { ToastrModule } from "ngx-toastr";
import { environment } from "../environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MaterialModule } from "./material/material.module";
import { NavigationComponent } from "./navigation/navigation.component";
import { ClientDataAccessStateModule } from "@kling/client/data-access/state";
import { SharedModule } from "./shared/shared.module";

registerLocaleData(localeDe, "de", localeDeExtra);

export const LOCAL_STORAGE = new InjectionToken<Storage>("LOCALSTORAGE");

export function createTranslateLoader(http: HttpClient): TranslateLoader {
	return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

const monacoConfig: NgxMonacoEditorConfig = {
	//baseUrl: "./assets", // configure base path for monaco editor default: './assets'
	defaultOptions: { scrollBeyondLastLine: false }, // pass default options to be used
	onMonacoLoad: () => {
		console.log(window.monaco);
		// register Monaco languages
		monaco.languages.register({
			id: "typescript",
			extensions: [".ts"],
			aliases: ["typescript, ts"],
			mimetypes: ["application/text"]
		});
	}
};

@NgModule({
	declarations: [AppComponent, NavigationComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		TranslateModule.forRoot({
			defaultLanguage: localStorage.getItem("language") ?? "en",
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient]
			}
		}),
		ToastrModule.forRoot({
			positionClass: "toast-bottom-right"
		}),
		SharedModule,
		MaterialModule,
		LayoutModule,
		MonacoEditorModule.forRoot(monacoConfig),
		MarkdownModule.forRoot({
			loader: HttpClient,
			sanitize: SecurityContext.NONE
		}),
		ContextMenuModule.forRoot(),
		ApiModule.forRoot(
			() =>
				new Configuration({
					basePath: window["__env"]["API_BASE_PATH"] ?? environment.API_BASE_PATH
					//accessToken: (): string => AuthService.getAccessToken()
				})
		),
		NgxMatSelectSearchModule,
		NgTerminalModule,
		ClientDataAccessStateModule,
		StoreDevtoolsModule.instrument({
			name: "Instruments DevTools",
			maxAge: 25
		})
	],
	providers: [
		{ provide: LOCALE_ID, useValue: "de" },
		{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: "outline" } },
		{ provide: LOCAL_STORAGE, useValue: localStorage }
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
