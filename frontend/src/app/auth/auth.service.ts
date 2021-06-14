import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject, from, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AuthUser } from './auth-user.model';

interface TokenPayload {
  idutente: string;
  idutcas: string;
  username: string;
  // idcommessa: string;
  commessa: string;
  autorizzazione: string;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private activeLogoutTimer;
  private jwtHelper;

  constructor(private http: HttpClient) {
    this.jwtHelper = new JwtHelperService();
  }

  /** currentUser DEVE essere un Osservabile perché altrimenti
   * la direttiva *userIsAdmin non funziona correttamente e
   * il template non viene aggiornato in tempo in base al ruolo*/

  private _user = new BehaviorSubject<AuthUser>(null);
  get currentUser$() {
    return this._user.asObservable().pipe(
      // take(1),
      map((user) => {
        if (user) {
          return user;
        } else {
          return null;
        }
      })
    );
  }

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

  autoLogin() {
    return from(Storage.get({ key: 'authData' })).pipe(
      map((storedData) => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value);
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new AuthUser(
          parsedData.idutente,
          parsedData.idutcas,
          parsedData.username,
          parsedData.idcommessa,
          'parsedData.commessa',
          parsedData.autorizzazione,
          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap((user) => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map((user) => {
        return !!user;
      })
    );
  }

  login(username: string, password: string) {
    return this.http.post(`${environment.apiUrl}/token/`, {}).pipe(
      catchError((err) => {
        return throwError('Errore server');
      }),
      switchMap((loginToken) => {
        if (!loginToken) {
          throw new Error('Errore server');
        }
        console.log('🐱‍👤 : AuthService : loginToken', loginToken);
        return this.http.post(
          `${environment.apiUrl}/lgn/`,
          {
            usr: username,
            pwd: password,
          },
          {
            headers: new HttpHeaders().set('Authorization', `Bearer ${loginToken['token']}`),
          }
        );
      }),
      catchError((err) => {
        return throwError('Errore server');
      }),
      tap((token: string) => {
        if (!token) {
          throw new Error('Credenziali errate');
        } else {
          this.setUserData(token);
        }
      })
    );
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
        })
      );
  }

  setUserData(token) {
    const payload: TokenPayload = this.jwtHelper.decodeToken(token['token']);
    console.log('🐱‍👤 : AuthService : payload', payload);
    const expDate: Date = this.jwtHelper.getTokenExpirationDate(token['token']);
    console.log('🐱‍👤 : AuthService : expDate', expDate);

    // * Crea un nuovo utente
    const newUser = new AuthUser(
      payload.idutente,
      payload.idutcas,
      payload.username,
      payload.commessa, // TODO: payload['idcommessa]
      'payload.commessa',
      payload.autorizzazione,
      token['token'],
      expDate
    );

    // * Produce un nuovo utente sull'osservabile
    this._user.next(newUser);

    // * Salva i parametri dell'utente sul localStorage
    Storage.set({
      key: 'authData',
      value: JSON.stringify({
        idutente: newUser.idutente,
        idutcas: newUser.idutcas,
        username: newUser.username,
        idcommessa: newUser.idcommessa, // TODO: payload['idcommessa]
        commessa: 'newUser.commessa',
        autorizzazione: newUser.autorizzazione,
        token: newUser.token,
        tokenExpirationDate: newUser.tokenExpirationDate.toISOString(),
      }),
    });

    // * Imposta un nuovo timer per l'autologout
    this.autoLogout(newUser.tokenDuration);
  }

  autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Storage.remove({ key: 'authData' });
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }
}
