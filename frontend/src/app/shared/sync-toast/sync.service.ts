import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concat, Observable, of, Subject, throwError } from 'rxjs';
import { switchMap, map, retryWhen, delay, take, concatMap, catchError, tap, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface SyncInfo {
  cod: string;
  pk: string;
  idutente: string;
  status: string;
  check: number;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  sync: SyncInfo;
  CHECK_INTERVAL: number = 5000;
  TOTAL_CHECKS: number = 5;

  constructor(
    private http: HttpClient,
  ) { }

  // Observable string sources
  private syncInfoSource = new Subject<SyncInfo>();
  private syncCheckSource = new Subject<SyncInfo>();

  // Observable string streams
  syncInfo$ = this.syncInfoSource.asObservable();
  syncCheck$ = this.syncCheckSource.asObservable();

  // Service message commands
  requestSync(idutente: string, pk: string) {
    return this.http.get(
      `${environment.apiUrl}/alfanumcasuale`
    ).pipe(
      switchMap((cod: string) => {
        console.log('codicecasucale: ', cod);
        this.sync = {
          cod: cod,
          pk: pk,
          idutente: idutente,
          status: 'richiesta',
          check: 0,
          date: new Date()
        }
        // this.syncInfoSource.next(this.sync);
        return this.http.get(`${environment.apiUrl}/sincrodb/${idutente}/${pk}/${this.sync.cod}`);
      }),
      switchMap(sincroStarted => {
        console.log('sincroStarted: ', sincroStarted);
        if (sincroStarted) {
          this.sync.status = 'in corso...';
          // this.sync.date = new Date();
          this.syncInfoSource.next(this.sync);
          return this.sincroDbCheck();
        } else {
          this.sync.status = 'fallita';
          // this.sync.date = new Date();
          this.syncInfoSource.next(this.sync);
          return of(false);
        }
      })
    );
  }

  sincroDbStart(idutente: string, pk_proj: string) {
    return this.http
      .get(
        `${environment.apiUrl}/sincrodb/${idutente}/${pk_proj}/${this.sync.cod}`,
      );
  }

  sincroDbCheck(): Observable<boolean | Object> {
    return this.http
      .get(
        `${environment.apiUrl}/checksincrodb/${this.sync.cod}`,
      ).pipe(
        map(result => {
          console.log('check result: ', result);
          let newResult = (Math.random() * 5) > 4; // returns a random integer from 0 to 10
          if (!newResult) {
            this.sync.check++;
            this.syncInfoSource.next(this.sync);
            throw newResult;
          }
          //error will be picked up by retryWhen
          this.sync.status = 'completata';
          return newResult;
        }),
        retryWhen(errors =>
          errors.pipe(
            tap(val => console.log(`Sincronizzazione non ancora completata!`)),
            delay(this.CHECK_INTERVAL), //prod: 600000
            take(this.TOTAL_CHECKS), //prod: 20
            // TODO: devo rilanciare un errore se scade il tempo!
            // Throw an exception to signal that the error needs to be propagated
            // concat(Observable.throw(new Error('Retry limit exceeded!')))
            finalize(() => console.log('Retry limit exceeded!'))
          ),
        ),
      );
  }

}
