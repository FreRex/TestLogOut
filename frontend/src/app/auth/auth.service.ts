import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  // TODO: set to false
  private _userIsAutenticated = true;
  get userIsAthenticated() { return this._userIsAutenticated; }

  private _userId: number;
  get userId() { return this._userId; }
  set userId(user: number) { this._userId = user; }


  private _token: string;
  get token(): string { return this._token; }

  authorizeAccess() {
    return this.http
      .post<{ [key: string]: string }>(`${environment.apiUrl}/token/`, {})
      .pipe(tap(res => {
        this._token = res['token'];
      }));
  }

  currentRole: string = '';
  onLogin(userId: number) {
    this.userId = userId;
    this.currentRole = this.userId === 0 ? 'admin' : 'user';
  }

  login() {
    this._userIsAutenticated = true;
    console.log("is logged in: " + this._userIsAutenticated);
  }

  logout() {
    this._userIsAutenticated = false;
    this._userId = null;
    console.log("is logged out: " + this._userIsAutenticated);
  }


}
