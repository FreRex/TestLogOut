import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.token}`,
      },
    });

    // return next.handle(request);

    return next.handle(request).pipe(
      map(
        (res: HttpEvent<any>) => {
          if (res instanceof HttpResponse) {
            // console.log(res);
            // do stuff with response if you want
            return res;
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              console.log('error');
              // throw err;
              // redirect to the login route or show a toast
            }
          }
        }
      )
      // retryWhen(err =>
      //   err.pipe(
      //     // tap(val => console.log(`Value ${val} was too high!`)),
      //     delay(3000),
      //     take(5),
      //     // TODO: devo rilanciare un errore se scade il tempo!
      //     // Throw an exception to signal that the error needs to be propagated
      //     // concat(Observable.throw(new Error('Retry limit exceeded!')))
      //   ),
      // )
    );
  }
}
