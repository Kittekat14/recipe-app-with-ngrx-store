import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

// Helper functions for same logic in Signup and Login Process:
// Successfully logging in/signing up
const handleAuthentication = (
  email: string,
  userId: string,
  token: string,
  expiresIn: number
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('user', JSON.stringify(user));

  return new AuthActions.Login({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
    redirect: true,
  });
};
// Handling error response if logging in or signing up fails
const handleError = (errorResponse: HttpErrorResponse) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorResponse.error || !errorResponse.error.error) {
    // no throwError() here, because this stops the Observable entirely!
    // Instead of() to create a follow-up Observable
    return of(new AuthActions.LoginFail(errorMessage));
  }
  switch (errorResponse.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email is already registered.';
      break;
    case 'INVALID_LOGIN_CREDENTIALS':
      errorMessage = 'Your email or password is incorrect.';
      break;
  }
  return of(new AuthActions.LoginFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  // Observable called actions$, that gives you access to all dispatched actions in our app;
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  // Here in effects, you don't change any state like in the reducer but you can do something when a specific action happens

  // side effect for Signup HTTP request:
  authSignup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupAction: AuthActions.SignupStart) => {
        return this.http
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
            {
              email: signupAction.payload.email,
              password: signupAction.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap((resData) => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            // creating a new observable stream with map()
            map((resData) => {
              return handleAuthentication(
                resData.email,
                resData.localId,
                resData.idToken,
                +resData.expiresIn
              );
            }),
            catchError((errorRes) => {
              return handleError(errorRes);
            })
          );
      })
    )
  );

  // side effect of Login HTTP request:
  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      // getting the data from that observable triggered by LOGIN_START action
      switchMap((authData: AuthActions.LoginStart) => {
        return (
          this.http
            .post<AuthResponseData>(
              `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
              {
                email: authData.payload.email,
                password: authData.payload.password,
                returnSecureToken: true,
              }
            )
            // here you want to dispatch new actions once the request was made
            .pipe(
              // here: we want to set a timer to logout after expirationTime
              // using tap() (-->not returning or changing anything we are getting)
              tap((resData) => {
                this.authService.setLogoutTimer(+resData.expiresIn * 1000);
              }),
              // creating a new observable stream with map()
              map((resData) => {
                return handleAuthentication(
                  resData.email,
                  resData.localId,
                  resData.idToken,
                  +resData.expiresIn
                );
              }),
              catchError((errorRes) => {
                return handleError(errorRes);
              })
            )
        );
      })
    )
  );

  // side effect of Router navigation; NOT dispatching a new Action (like by default) => dispatch: false
  authRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGIN),
        tap((authSuccessAction: AuthActions.Login) => {
          if (authSuccessAction.payload.redirect) {
            this.router.navigate(['/']);
          } else {
            of(authSuccessAction);
          }
        })
      ),
    { dispatch: false }
  );

  authLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
          this.router.navigate(['/auth']);
          localStorage.removeItem('user');
          this.authService.clearLogoutTimer();
        })
      ),
    { dispatch: false }
  );

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),

      // tap() won't return anything, but map() does!
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: Date;
        } = JSON.parse(localStorage.getItem('user'));

        if (!userData) {
          return { type: 'NO USER IN LOCALSTORAGE' };
        }

        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
          // we emit the already authenticated user with the valid token
          // this.user.next(loadedUser);

          const expirationDuration =
            // future time minus time now:
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();

          this.authService.setLogoutTimer(expirationDuration);

          return new AuthActions.Login({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false,
          });
        } else {
          return { type: 'NO VALID TOKEN IN LOCALSTORAGE' };
        }
      })
    )
  );
}
