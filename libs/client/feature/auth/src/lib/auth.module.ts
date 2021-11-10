import { NgModule } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { getEnvVariableOrThrow } from "@web-ide/client-environments";
import { TranslateModule } from "@ngx-translate/core";
import { LoginDialogComponent } from "./dialogs/login/login.dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { IconModule } from "@web-ide/client/shared/components";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";

@NgModule({
	declarations: [LoginDialogComponent],
	imports: [
		CommonModule,
		IconModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatDialogModule,
		TranslateModule,
		MatCardModule,
		TranslateModule,
		MatProgressSpinnerModule
	],
	providers: [
		{
			provide: "SPARKY_AUTHENTICATE_URL",
			useValue: getEnvVariableOrThrow("AUTH_BASE_PATH") + "/api/v1/authenticate"
		}
	]
})
export class AuthModule {}
