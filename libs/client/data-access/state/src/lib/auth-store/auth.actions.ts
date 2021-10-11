import { createAction, props } from "@ngrx/store";
import { UserDto } from "@student-mgmt/api";

export const login = createAction(
	"[Login Dialog] Login",
	props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
	"[login$ Effect] Login Success",
	props<{ user: UserDto; accessToken: string }>()
);

export const loginFailure = createAction(
	"[login$ Effect] Login Failure",
	props<{ error: unknown }>()
);

export const logout = createAction("[Logout] Logout");
