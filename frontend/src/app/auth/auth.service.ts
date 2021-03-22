import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // TODO: set to false
  private _userIsAutenticated = true;
  private _user: number;

  // TODO: rendere userIsAthenticated un BehaviourSubject e ritornare un Osservabile
  get userIsAthenticated() {
    return this._userIsAutenticated;
  }

  get user() {
    return this._user;
  }

  set user(user: number){
    this._user = user;
  }

  constructor(
    private http: HttpClient,
  ) { }

  login() {
    this._userIsAutenticated = true;
    console.log("is logged in: " + this._userIsAutenticated);
  }

  logout() {
    this._userIsAutenticated = false;
    this._user = null;
    console.log("is logged out: " + this._userIsAutenticated);
  }

  private _token: string;
  get token(): string { return this._token; }

  authorizeAccess() {
    return this.http
      .post<{ [key: string]: string }>(`${environment.apiUrl}/token/`, {})
      .pipe(tap(res => { 
        this._token = res['token']; 
      }));
  }
}
