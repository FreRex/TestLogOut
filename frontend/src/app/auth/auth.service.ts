import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { User } from '../backoffice/users/user.service';

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
  set userId(user: number){ this._userId = user; }

  // currentUser: BehaviorSubject<User> = new BehaviorSubject(null);
  // currentUser$ = this.currentUser.asObservable();
  currentRole: BehaviorSubject<string> = new BehaviorSubject(null);
  currentRole$ = this.currentRole.asObservable();

  onLogin(userId: number){
    this.userId = userId;
    if(this.userId === 0){
      console.log("Role:", 'admin');
      this.currentRole.next('admin');
      // this.currentUser.next({
      //   id: userId,
      //   collaudatoreufficio: "Collaudatore1",
      //   username: "username1",
      //   password: "password1",
      //   autorizzazioni: 0,
      //   roles: ['admin']
      // });
    } else {
      console.log("Role:", 'user');
      this.currentRole.next('user');
      // this.currentUser.next({
      //   id: userId,
      //   collaudatoreufficio: "Collaudatore1",
      //   username: "username1",
      //   password: "password1",
      //   autorizzazioni: 1,
      //   roles: ['user']
      // });
    }
  }
  onLogout(){
    // this.currentUser.next(null);
    this.currentRole.next(null);
  }
  hasRoles(roles: string[]): boolean{
    for(const oneRole of roles){
      // if(!this.currentUser || !this.currentUser.value.roles.includes(oneRole)){
      //   return false;
      // }
      if(!this.currentRole || !this.currentRole.value.includes(oneRole)){
        return false;
      }
    }
    return true;
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
