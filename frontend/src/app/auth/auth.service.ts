import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // TODO: set to false
  private _userIsAutenticated = true;
  private _user: string = '';

  get userIsAthenticated(){
    return this._userIsAutenticated;
  }

  get user(){
    return this._user;
  }

  constructor() { }

  login(user: string) {
    this._userIsAutenticated = true;
    this._user = user;
    console.log("is logged in: " + this._userIsAutenticated);
  }

  logout() {
    this._userIsAutenticated = false;
    this._user = '';
    console.log("is logged out: " + this._userIsAutenticated);
  }
}
