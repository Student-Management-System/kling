import { LayoutModule } from "@angular/cdk/layout";
import { registerLocaleData } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import localeDe from "@angular/common/locales/de";
import localeDeExtra from "@angular/common/locales/extra/de";
import { LOCALE_ID, NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthModule, AuthService } from "@kling/client-auth";
import { getEnvVariableOrThrow } from "@kling/client-environments";
import { ClientStateModule } from "@kling/client/data-access/state";
import { IdeServicesModule } from "@kling/ide-services";
import { INDEXED_DB } from "@kling/indexed-db";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import {
	ApiModule as StudentMgmtApiModule,
	Configuration as StudentMgmtConfiguration
} from "@student-mgmt/api-client";
import { ContextMenuModule } from "ngx-contextmenu";
import { ToastrModule } from "ngx-toastr";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavigationModule } from "./navigation/navigation.module";

registerLocaleData(localeDe, "de", localeDeExtra);

export function createTranslateLoader(http: HttpClient): TranslateLoader {
	return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
	declarations: [AppComponent],
	imports: [
		NavigationModule,
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
		})
	],
	providers: [
		{ provide: LOCALE_ID, useValue: "de" },
		{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: "outline" } },
		{ provide: INDEXED_DB, useValue: indexedDB }
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
