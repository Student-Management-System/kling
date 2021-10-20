import { LayoutModule } from "@angular/cdk/layout";
import { registerLocaleData } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import localeDe from "@angular/common/locales/de";
import localeDeExtra from "@angular/common/locales/extra/de";
import { InjectionToken, LOCALE_ID, NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthModule, AuthService } from "@kling/client-auth";
import { getEnvVariableOrThrow } from "@kling/client-environments";
import { ClientStateModule } from "@kling/client/data-access/state";
import { ConfirmDialogModule } from "@kling/client/shared/components";
import { IdeServicesModule } from "@kling/ide-services";
import { INDEXED_DB } from "@kling/indexed-db";
import { ApiModule, Configuration } from "@kling/shared/data-access/api-rest-ng-client";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import {
	ApiModule as StudentMgmtApiModule,
	Configuration as StudentMgmtConfiguration
} from "@student-mgmt/api";
import { ContextMenuModule } from "ngx-contextmenu";
import { ToastrModule } from "ngx-toastr";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavigationModule } from "./navigation/navigation.module";

registerLocaleData(localeDe, "de", localeDeExtra);

export const LOCAL_STORAGE = new InjectionToken<Storage>("LOCALSTORAGE");

export function createTranslateLoader(http: HttpClient): TranslateLoader {
	return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
	declarations: [AppComponent],
	imports: [
		NavigationModule,
		ConfirmDialogModule,
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
		ApiModule.forRoot(
			() =>
				new Configuration({
					basePath: getEnvVariableOrThrow("API_BASE_PATH")
				})
		),
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
		})
	],
	providers: [
		{ provide: LOCALE_ID, useValue: "de" },
		{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: "outline" } },
		{ provide: LOCAL_STORAGE, useValue: localStorage },
		{ provide: INDEXED_DB, useValue: indexedDB }
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
