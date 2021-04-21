import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { UserService } from '../shared/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
  ) { }

  // TODO: set to false
  private _userIsAutenticated = true;
  get userIsAthenticated() { return this._userIsAutenticated; }

  // get userId() { return this._userId; }
  // set userId(user: number) { this._userId = user; }


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

  /** currentRole DEVE essere un Osservabile perchè altrimenti 
   * la direttiva *userIsAdmin non funziona correttamente e 
   * il template non viene aggiornato in tempo in base al ruolo*/
  currentRole: BehaviorSubject<string> = new BehaviorSubject(null);
  currentRole$ = this.currentRole.asObservable();

  _userId: number = 0;
  get userId() { return this._userId; };
  set userId(userId: number) { this._userId = userId; };

  onLogin(userId: number) {
    if (this.currentRole.value == null) {
      console.log('userId: ', userId);
      this.userId = userId;
      if (this.userId === 0) { this.currentRole.next('admin'); }
      else { this.currentRole.next('user'); }
      console.log('this.currentRole.value', this.currentRole.value);
    }
  }

  _userCod: string = '0';
  get userCod() { return this._userCod; };
  set userCod(userId: string) { this._userCod = userId; };

  onLoginCod(userCod: string, userRole: string) {
    if (this.currentRole.value == null) {
      console.log('userCod: ', userCod);
      console.log('userRole: ', userRole);
      this.userCod = userCod;
      this.currentRole.next(userRole);
    }
  }

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
