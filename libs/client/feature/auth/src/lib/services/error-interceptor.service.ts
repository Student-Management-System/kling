import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest
} from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { ToastService } from "@kling/client-shared";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {
	constructor(private injector: Injector) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(req).pipe(catchError(x => this.handleHttpError(x)));
	}

	/**
	 * Invoked when user is not logged in or user's authentication token has expired.
	 */
	private handleHttpError(err: HttpErrorResponse): Observable<any> {
		const authService = this.injector.get(AuthService);

		if (err.status == 0) {
			const toast = this.injector.get(ToastService);
			toast.error("Error.ConnectionRefused");
		}

		if (err.status === 401) {
			const toast = this.injector.get(ToastService);
			toast.error("Error.Unauthorized");
			authService.logout();
		}

		return throwError(err);
	}
}
