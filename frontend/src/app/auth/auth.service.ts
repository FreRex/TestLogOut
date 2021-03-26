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

  // get userId() { return this._userId; }
  // set userId(user: number) { this._userId = user; }


  token: string = '';
  getToken() {
    return this.http
      .post<{ [key: string]: string }>(`${environment.apiUrl}/token/`, {})
      .pipe(tap(res => {
        this.token = res['token'];
      }));
  }

  // currentRole: BehaviorSubject<string> = new BehaviorSubject(null);
  // currentRole$ = this.currentRole.asObservable();

  userId: string = '';
  currentRole: string = '';
  onLogin(userId: string) {
    if (this.userId == '') {
      this.userId = userId;
      // if(this.userId === 0){ this.currentRole.next('admin'); }
      // else { this.currentRole.next('user'); }
      this.currentRole = this.userId == '0' ? 'admin' : 'user';
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
