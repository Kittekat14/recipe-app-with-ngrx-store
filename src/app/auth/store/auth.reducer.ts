import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface UserState {
  user: User;
  error: string;
  loading: boolean;
}

const initialState: UserState = {
  user: null,
  error: null,
  loading: false,
};

export function authReducer(
  state: UserState = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.LOGIN:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );

      return {
        ...state,
        user: user,
        error: null,
        loading: false,
      };

    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return {
        ...state,
        error: null,
        loading: true,
      };

    case AuthActions.LOGIN_FAIL:
      return {
        ...state,
        user: null,
        error: action.payload,
        loading: false,
      };

    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
      };

    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}
