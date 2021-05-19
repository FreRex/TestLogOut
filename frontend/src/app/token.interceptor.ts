import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';

import { AuthService } from './auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.currentUser$.pipe(
      // take(1),
      exhaustMap((user) => {
        console.log('🐱‍👤 : TokenInterceptor : user', user);
        if (!user) {
          return next.handle(request);
        }
        const modifiedRequest = request.clone({
          // setHeaders: {
          //   Authorization: `Bearer ${user.token.toString()}`,
          // },
          headers: new HttpHeaders().set(
            'Authorization',
            'Bearer ' + user.token
          ),
        });
        console.log(
          '🐱‍👤 : TokenInterceptor : modifiedRequest',
          modifiedRequest
        );
        return next.handle(modifiedRequest);
      })
    );

    // eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHV0ZW50ZSI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImNvbW1lc3NhIjowLCJhdXRvcml6emF6aW9uZSI6MSwiaWF0IjoxNjIxNDQzMzM2LCJleHAiOjE2MjE0NDY5MzZ9.VZDfj9VuxfiBm0F7wknbXn2SiatJ_D4bCPF5HkcRtoFNZyWi9FcGWNHraIKuOqQUcxmNu5xYbm-tyodvsHaLZXaVLPnVOc3bX88M2Si2eIq8Nplol6Hpap_wi1OVA_Avtt2hUwICBKByhVE3tnIqkOEhC5BD6UnCAPWoIq7cwmkh2GOl6Lzs9rU_-0xQWnPS5Qbna9bP97n6I6FrjDKFH4ztlpKwkbQ94mOxeaUdN8iHLCB1u0fY58hbEOdRD4ekiH9P0ZphRhNC5DAOtMbUuzCaQYr2a7aMTXm2k4kFCYMAhK7UuNEagKEzAkLXXV7DZr1_qREH7V4UCpSiVs4YLQ
    // eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHV0ZW50ZSI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImNvbW1lc3NhIjowLCJhdXRvcml6emF6aW9uZSI6MSwiaWF0IjoxNjIxNDQzMzM2LCJleHAiOjE2MjE0NDY5MzZ9.VZDfj9VuxfiBm0F7wknbXn2SiatJ_D4bCPF5HkcRtoFNZyWi9FcGWNHraIKuOqQUcxmNu5xYbm-tyodvsHaLZXaVLPnVOc3bX88M2Si2eIq8Nplol6Hpap_wi1OVA_Avtt2hUwICBKByhVE3tnIqkOEhC5BD6UnCAPWoIq7cwmkh2GOl6Lzs9rU_-0xQWnPS5Qbna9bP97n6I6FrjDKFH4ztlpKwkbQ94mOxeaUdN8iHLCB1u0fY58hbEOdRD4ekiH9P0ZphRhNC5DAOtMbUuzCaQYr2a7aMTXm2k4kFCYMAhK7UuNEagKEzAkLXXV7DZr1_qREH7V4UCpSiVs4YLQ

    // return next.handle(request).pipe(
    //   map(
    //     (res: HttpEvent<any>) => {
    //       if (res instanceof HttpResponse) {
    //         // console.log(res);
    //         // do stuff with response if you want
    //         return res;
    //       }
    //     },
    //     (err: any) => {
    //       if (err instanceof HttpErrorResponse) {
    //         if (err.status === 401) {
    //           console.log('error');
    //           // throw err;
    //           // redirect to the login route or show a toast
    //         }
    //       }
    //     }
    //   )
    //   // retryWhen(err =>
    //   //   err.pipe(
    //   //     tap(val => console.log(`Value ${val} was too high!`)),
    //   //     delay(3000),
    //   //     take(5),
    //   //     // TODO: devo rilanciare un errore se scade il tempo!
    //   //     // Throw an exception to signal that the error needs to be propagated
    //   //     // concat(Observable.throw(new Error('Retry limit exceeded!')))
    //   //   ),
    //   // )
    // );
  }
}
