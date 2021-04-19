import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Observable, timer, of } from 'rxjs';
import { delay, delayWhen, map, retryWhen, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';

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


  searchCity( nomeCity: string){
    return this.http
      .get(
        `https://www.gerriquez.com/comuni/ws.php?dencomune=${nomeCity}`,
      )
  }

  sincroDbStart(
    collaudatoreufficio: string,
    pk_proj: number 
  ) {
    const idutente = this.userService.getUserIdByName(collaudatoreufficio);
    return this.http.get(
      `${environment.apiUrl}/alfanumcasuale`,
      { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
      ).pipe(
        switchMap(
          codicecasuale => {
            this.codicealfa = codicecasuale;
            return this.http
            .get(
              `${environment.apiUrl}/sincrodb/${idutente}/${pk_proj}/${this.codicealfa}`,
              { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
            );
          }
        )
      );
  }

  sincroDbCheck(): Observable<boolean | Object>{
    return this.http.get(
      `${environment.apiUrl}/checksincrodb/${this.codicealfa}`,
      { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
    ).pipe(
      map(result => {
        console.log('result', result);
        const newResult = Math.random() < 0.5;
        if (!newResult) { //error will be picked up by retryWhen
          console.log('if error', newResult);
          throw newResult;
        }
        return newResult;
      }),
      retryWhen(errors => 
        errors.pipe(
          // tap(val => console.log(`Value ${val} was too high!`)),
          delay(1000),
          take(8)
        )
      )
    );
  }
}
