import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Plugins } from '@capacitor/core';
import { BehaviorSubject, from, throwError } from 'rxjs';
import { catchError, map, shareReplay, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { User } from '../admin/users-tab/user.service';
import { AuthUser } from './auth-user.model';

interface TokenPayload {
  exp: number;
  iat: number;
  password: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  helper;

  constructor(private http: HttpClient) {
    this.helper = new JwtHelperService();
  }

  private _token: string = '';
  get token() {
    return this._token;
  }
  set token(token: string) {
    this._token = token;
  }

  fetchToken() {
    return this.http
      .post<{ [key: string]: string }>(`${environment.apiUrl}/token/`, {})
      .pipe(
        catchError((err) => {
          return throwError(err);
        }),
        tap((res) => {
          this._token = res['token'];
        })
      );
  }

  /** currentUser DEVE essere un Osservabile perché altrimenti
   * la direttiva *userIsAdmin non funziona correttamente e
   * il template non viene aggiornato in tempo in base al ruolo*/
  currentUser: BehaviorSubject<User> = new BehaviorSubject(null);
  currentUser$ = this.currentUser.asObservable();

  _userCod: string = '';
  get userCod() {
    return this._userCod;
  }
  set userCod(userId: string) {
    this._userCod = userId;
  }

  onLogin(user: User) {
    if (this.userCod === '') {
      this.userCod = user.autorizzazione === 'admin' ? '0' : user.idutcas;
      this.currentUser.next(user);
    }
  }

  private _user = new BehaviorSubject<AuthUser>(null);

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          // ritorna vero se esiste, falso se non esiste
          return !!user.token; // --> !! forza una conversione a Boolean del token
        } else {
          return false;
        }
      })
    );
  }

  get authUser() {
    return this._user.asObservable().pipe(
      take(1),
      map((user) => {
        if (user) {
          return user;
        } else {
          return null;
        }
      })
    );
  }

  // get userId() {
  //   return this._user.asObservable().pipe(
  //     map(user => {
  //       if (user) {
  //         return user.id;
  //       } else {
  //         return null;
  //       }
  //     })
  //   );
  // }

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'authData' })).pipe(
      map((storedData) => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          username: string;
          token: string;
          tokenExpirationDate: string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new AuthUser(
          '1',
          parsedData.username,
          'commessa',
          '2',
          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap((user) => {
        if (user) {
          this._user.next(user);
        }
      }),
      map((user) => {
        return !!user;
      })
    );
  }

  login(username: string, password: string) {
    return this.http
      .post(`${environment.apiUrl}/lgn/`, {
        usr: username,
        pwd: password,
      })
      .pipe(
        catchError((err) => {
          return throwError(err);
        }),
        tap((token: string) => {
          if (!token) {
            throw new Error('Credenziali errate');
          }
          this.setUserData(token);
        }),
        // https://accademia.dev/takeuntil-attenzione-a-sharereplay/
        shareReplay({ refCount: true, bufferSize: 1 })
      );
  }

  logout() {
    this._user.next(null);
  }

  signup(username: string, password: string) {
    return this.http
      .post(`${environment.apiUrl}/signup/`, {
        usr: username,
        pwd: password,
      })
      .pipe(
        catchError((err) => {
          return throwError(err);
        }),
        tap((token: string) => {
          if (!token) {
            throw new Error('Credenziali errate');
          }
          this.setUserData(token);
        }),
        // https://accademia.dev/takeuntil-attenzione-a-sharereplay/
        shareReplay({ refCount: true, bufferSize: 1 })
      );
  }

  setUserData(token) {
    console.log(token);
    const payload: TokenPayload = this.helper.decodeToken(token['token']);
    const expDate: Date = this.helper.getTokenExpirationDate(token['token']);
    // const expirationTime = new Date(new Date().getTime() + (+decodedToken.exp / 1000));
    console.log('decodedToken', payload);
    console.log('expirationDate', expDate);
    // console.log('expirationTime', expirationTime);
    this._user.next(
      new AuthUser('1', payload.username, 'commessa', '2', token, expDate)
    );
    this.storeAuthDate(
      '1',
      payload.username,
      'commessa',
      '2',
      token,
      expDate.toISOString()
    );
  }

  private storeAuthDate(
    userId: string,
    username: string,
    commessa: string,
    autorizzazione: string,
    token: string,
    tokenExpirationDate: string
  ) {
    const data = JSON.stringify({
      userId: userId,
      username: username,
      commessa: commessa,
      autorizzazione: autorizzazione,
      token: token,
      tokenExpirationDate: tokenExpirationDate,
    });
    console.log('data', data);
    Plugins.Storage.set({ key: 'authData', value: data });
  }
}
