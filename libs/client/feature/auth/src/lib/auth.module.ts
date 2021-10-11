import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { SharedModule } from "@kling/client-shared";
import { ErrorInterceptorService } from "..";
import { environment } from "../../../../../../apps/client/src/environments/environment";
import { LoginDialogComponent } from "./dialogs/login/login.dialog";

@NgModule({
	declarations: [LoginDialogComponent],
	imports: [SharedModule],
	providers: [
		{
			provide: "SPARKY_AUTHENTICATE_URL",
			useValue:
				(window["__env"]["AUTH_BASE_PATH"] ?? environment.AUTH_BASE_PATH) +
				"/api/v1/authenticate"
		}
		//{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true }
	]
})
export class AuthModule {}
