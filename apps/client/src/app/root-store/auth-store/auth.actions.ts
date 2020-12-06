import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";

export const requestAuthentication = createAction(
	"[Login Dialog] Request Authentication",
	props<{ token: string }>()
);

export const authenticationSuccess = createAction(
	"[Auth API] Authentication Success",
	props<{ authToken: any }>()
);

export const authenticationFail = createAction(
	"[Auth API] Authentication Failure",
	props<{ error: HttpErrorResponse }>()
);
