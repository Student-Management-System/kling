import { LayoutModule } from "@angular/cdk/layout";
import { registerLocaleData } from "@angular/common";
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import localeDe from "@angular/common/locales/de";
import localeDeExtra from "@angular/common/locales/extra/de";
import { LOCALE_ID, NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthModule, AuthService } from "@web-ide/client-auth";
import { getEnvVariableOrThrow } from "@web-ide/client-environments";
import { ClientStateModule } from "@web-ide/client/data-access/state";
import { IdeModule } from "@web-ide/ide";
import { IdeServicesModule } from "@web-ide/ide-services";
import { INDEXED_DB } from "@web-ide/indexed-db";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import {
	ApiModule as StudentMgmtApiModule,
	Configuration as StudentMgmtConfiguration
} from "@student-mgmt/api-client";
import { ContextMenuModule } from "@perfectmemory/ngx-contextmenu";
import { ToastrModule } from "ngx-toastr";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ErrorInterceptorService } from "./error-interceptor.service";

registerLocaleData(localeDe, "de", localeDeExtra);

export function createTranslateLoader(http: HttpClient): TranslateLoader {
	return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
	declarations: [AppComponent],
	imports: [
		MatDialogModule,
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		AuthModule,
		TranslateModule.forRoot({
			defaultLanguage: localStorage.getItem("language") ?? "en",
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient]
			}
		}),
		ToastrModule.forRoot({
			positionClass: "toast-bottom-right",
			progressBar: true
		}),
		LayoutModule,
		ContextMenuModule.forRoot(),
		StudentMgmtApiModule.forRoot(
			() =>
				new StudentMgmtConfiguration({
					accessToken: (): string => AuthService.getAccessToken(),
					basePath: getEnvVariableOrThrow("STUDENT_MGMT_BASE_PATH")
				})
		),
		IdeServicesModule,
		ClientStateModule,
		StoreDevtoolsModule.instrument({
			name: "Instruments DevTools",
			maxAge: 25
		}),
		IdeModule
	],
	providers: [
		{ provide: LOCALE_ID, useValue: "de" },
		{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: "outline" } },
		{ provide: INDEXED_DB, useValue: indexedDB },
		{ provide: HTTP_INTERCEPTORS, multi: true, useClass: ErrorInterceptorService }
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
