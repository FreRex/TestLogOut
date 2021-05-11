import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Observable, timer, of, forkJoin, concat } from 'rxjs';
import { delay, delayWhen, map, retryWhen, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../users-tab/user.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  codicealfa;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private authService: AuthService
  ) { }

  searchCity(nomeCity: string) {
    return this.http
      .get(
        `https://www.gerriquez.com/comuni/ws.php?dencomune=${nomeCity}`,
      )
  }

  sincroDb(idutente: number, pk_proj: number) {
    return this.http
      .get(
        `${environment.apiUrl}/alfanumcasuale`,
      ).pipe(
        switchMap(codicecasuale => {
          this.codicealfa = codicecasuale;
          console.log('codicecasucale: ', this.codicealfa);
          return this.sincroDbStart(idutente, pk_proj);
        }),
        switchMap(sincroStarted => {
          console.log('sincroStarted: ', sincroStarted);
          if (sincroStarted) {
            return this.sincroDbCheck();
          } else {
            return of(false);
          }
        })
      );
  }

  sincroDbStart(idutente: number, pk_proj: number) {
    return this.http
      .get(
        `${environment.apiUrl}/sincrodb/${idutente}/${pk_proj}/${this.codicealfa}`,
      );
  }

  sincroDbCheck(): Observable<boolean | Object> {
    return this.http
      .get(
        `${environment.apiUrl}/checksincrodb/${this.codicealfa}`,
      ).pipe(
        map(result => {
          console.log('check result: ', result);
          //error will be picked up by retryWhen
          if (!result) { throw result; }
          return result;
        }),
        retryWhen(errors =>
          errors.pipe(
            // tap(val => console.log(`Value ${val} was too high!`)),
            delay(60000),
            take(20),
            // TODO: devo rilanciare un errore se scade il tempo!
            // Throw an exception to signal that the error needs to be propagated
            // concat(Observable.throw(new Error('Retry limit exceeded!')))
          ),
        )
      );
  }
}
