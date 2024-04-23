import {
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      // take that user once ('take(1)'), no ongoing subscription => no need to unsubscribe as well!
      // exhaustMap: unsubscribes from the user observable called before and does some other things in the pipe
      take(1),
      exhaustMap((user) => {
        // the interceptor works for every http request, also for signin and signup post requests!
        // There, the user is set to null still and we don't set the token in the params, because we don't have them!
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
