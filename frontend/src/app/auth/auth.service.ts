import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user: string = '';
  
  // TODO: set to false
  private _userIsAutenticated = true;
  get userIsAthenticated(){
    return this._userIsAutenticated;
  }

  constructor() { }

  login(user: string) {
    this._userIsAutenticated = true;
    this._user = user;
  }

  logout() {
    this._userIsAutenticated = false;
    this._user = '';
  }
}
