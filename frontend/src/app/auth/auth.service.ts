import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user: string = '';
  
  private _userIsAutenticated = false;
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
