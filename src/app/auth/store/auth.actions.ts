import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] LOGIN Start';
export const LOGIN = '[Auth] LOGIN';
export const LOGIN_FAIL = '[Auth] LOGIN Fail';
export const AUTO_LOGIN = '[Auth] AUTOLOGIN';

export const SIGNUP_START = '[Auth] SIGNUP Start';
export const SIGNUP = '[Auth] SIGNUP';
export const SIGNUP_FAIL = '[Auth] SIGNUP Fail';

export const CLEAR_ERROR = '[Auth] CLEAR Error';

export const LOGOUT = '[Auth] LOGOUT';
export const AUTO_LOGOUT = '[Auth] AUTOLOGOUT';

export class SignupStart implements Action {
  readonly type = SIGNUP_START;

  constructor(public payload: { email: string; password: string }) {}
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string; password: string }) {}
}

export class LoginFail implements Action {
  readonly type = LOGIN_FAIL;

  constructor(public payload: string) {}
}

export class Login implements Action {
  readonly type = LOGIN;

  constructor(
    public payload: {
      email: string;
      userId: string;
      token: string;
      expirationDate: Date;
      redirect: boolean;
    }
  ) {}
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;

  constructor() {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}

export type AuthActions =
  | Login
  | Logout
  | LoginStart
  | LoginFail
  | SignupStart
  | ClearError
  | AutoLogin;
