import { NgModule } from "@angular/core";
import { getEnvVariableOrThrow } from "@kling/client-environments";
import { SharedModule } from "@kling/client-shared";
import { LoginDialogComponent } from "./dialogs/login/login.dialog";

@NgModule({
	declarations: [LoginDialogComponent],
	imports: [SharedModule],
	providers: [
		{
			provide: "SPARKY_AUTHENTICATE_URL",
			useValue: getEnvVariableOrThrow("AUTH_BASE_PATH") + "/api/v1/authenticate"
		}
	]
})
export class AuthModule {}
