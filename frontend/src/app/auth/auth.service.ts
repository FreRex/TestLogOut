import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { User, UserService } from '../admin/users-tab/user.service';
import { AuthUser } from './auth-user.model';
import { JwtHelperService } from '@auth0/angular-jwt';

interface TokenData {
  exp: number;
  iat: number;
  password: string;
  username: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  helper;

  constructor(
    private http: HttpClient,
  ) {
    this.helper = new JwtHelperService();
  }

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

  _userCod: string = '';
  get userCod() { return this._userCod; };
  set userCod(userId: string) { this._userCod = userId; };

  onLogin(user: User) {
    if (this.userCod === '') {
      this.userCod = user.autorizzazione === 'admin' ? '0' : user.idutcas;
      this.currentUser.next(user);
    }
  }

  private _user: BehaviorSubject<AuthUser> = new BehaviorSubject<AuthUser>(null);

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          // !! forza una conversione a Boolean del token 
          // ritorn vero se esiste, falso se non esiste
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get userName() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.username;
        } else {
          return null;
        }
      })
    );
  }

  login(username: string, password: string) {
    return this.http.post(`${environment.apiUrl}/lgn/`, {
      "usr": username,
      "pwd": password,
    }).pipe(
      catchError(err => { return throwError(err); }),
      tap((token: string) => {
        console.log(token);
        const decodedToken = this.helper.decodeToken(token['token']);
        const expirationDate = this.helper.getTokenExpirationDate(token['token']);
        // const expirationTime = new Date(new Date().getTime() + (+decodedToken.exp / 1000));

        console.log('decodedToken', decodedToken);
        console.log('expirationDate', expirationDate);
        // console.log('expirationTime', expirationTime);

        this._user.next(
          new AuthUser(
            // userData.id,
            decodedToken.username,
            token,
            expirationDate)
        );
      }),
      // https://accademia.dev/takeuntil-attenzione-a-sharereplay/
      shareReplay({ refCount: true, bufferSize: 1 }),
    )
  }

  logout() {
    this._user.next(null);
  }

  signup(username: string, password: string) {
    return this.http.post(`${environment.apiUrl}/signup/`, {
      "usr": username,
      "pwd": password,
    }).pipe(
      catchError(err => { return throwError(err); }),
      // tap(userData => this.setUserData(userData))
      // tap(this.setUserData.bind(this))
    )
  }

  // setUserData(userData) {
  //   const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
  //   this._user.next(
  //     new AuthUser(
  //       // userData.id,
  //       userData.username,
  //       userData.token,
  //       expirationTime)
  //   );
  // }

}
