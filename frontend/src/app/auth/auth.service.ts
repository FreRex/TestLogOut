import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { User, UserService } from '../shared/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
  ) { }

  private _token: string = '';
  get token() { return this._token; }
  set token(token: string) { this._token = token; }

  fetchToken() {
    return this.http
      .post<{ [key: string]: string }>(`${environment.apiUrl}/token/`, {})
      .pipe(
        catchError(err => { return throwError(err); }),
        tap(res => { this._token = res['token']; })
      );
  }

  /** currentUser DEVE essere un Osservabile perchè altrimenti 
   * la direttiva *userIsAdmin non funziona correttamente e 
   * il template non viene aggiornato in tempo in base al ruolo*/
  currentUser: BehaviorSubject<User> = new BehaviorSubject(null);
  currentUser$ = this.currentUser.asObservable();

  _userCod: string = '0';
  get userCod() { return this._userCod; };
  set userCod(userId: string) { this._userCod = userId; };

  onLogin(user: User) {
    this.userCod = user.autorizzazioni === 'admin' ? '0' : user.idutcas;
    this.currentUser.next(user);
  }

  private _userIsAutenticated = true;
  get userIsAthenticated() { return this._userIsAutenticated; }

  _userId: number;
  get userId() { return this._userId; }
  set userId(user: number) { this._userId = user; }

  login() {
    this._userIsAutenticated = true;
    console.log("is logged in: " + this._userIsAutenticated);
  }

  logout() {
    this._userIsAutenticated = false;
    this.userId = null;
    console.log("is logged out: " + this._userIsAutenticated);
  }
}
