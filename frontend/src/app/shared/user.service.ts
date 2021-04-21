import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

export interface UserData {
  id: number;
  idutcas: string;
  DataCreazione: Date;
  collaudatoreufficio: string;
  username: string;
  password: string;
  autorizzazioni: number;
  commessa?: string;
}

export interface User {
  id: number;
  idutcas: string;
  DataCreazione: Date;
  collaudatoreufficio: string;
  username: string;
  password: string;
  autorizzazioni: string;
  commessa: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private usersSubject = new BehaviorSubject<User[]>([]);
  users$: Observable<User[]> = this.usersSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getUser(userId: number): Observable<User> {
    return this.users$
      .pipe(
        take(1),
        map((users: User[]) => {
          return { ...users.find((user) => user.id === userId) };
        })
      );
  }

  getUsersByFilter(query: string): Observable<User[]> {
    return this.users$.pipe(
      map((users) =>
        users.filter((user) =>
          user.collaudatoreufficio.toLowerCase().includes(query.toLowerCase()) ||
          user.id.toString().toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  getUserIdByName(name: string) {
    //TODO: probabilmente c'è un modo più elegante
    let userID: number;
    this.users$.pipe(
      take(1),
      map((users: User[]) => {
        return { ...users.find(user => user.collaudatoreufficio === name) };
      })
    ).subscribe(user => userID = user.id);
    return userID;
  }

  getUserRoleByCod(cod: string) {
    //TODO: probabilmente c'è un modo più elegante
    let role: string;
    this.users$.pipe(
      take(1),
      map((users: User[]) => {
        return { ...users.find(user => user.idutcas === cod) };
      })
    ).subscribe(user => role = user.autorizzazioni);
    return role;
  }

  /** SELECT utenti */
  loadUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(
        `${environment.apiUrl}/s/utenti/`,
        { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
      ).pipe(
        // <-- Rimappa i dati che arrivano dal server sull'interfaccia della Room
        map(data => {
          const users: User[] = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              users.push({
                id: data[key].id,
                idutcas: data[key].idutcas,
                DataCreazione: data[key].DataCreazione,
                collaudatoreufficio: data[key].collaudatoreufficio,
                username: data[key].username,
                password: data[key].password,
                autorizzazioni: data[key].autorizzazioni.toString() === '1' ? 'admin' : 'user',
                commessa: 'commessa',
              });
            }
          }
          return users;
        }),
        tap((users: User[]) => {
          this.usersSubject.next(users);
        })
      );
  }

  /** CREATE utenti */
  addUser(
    collaudatoreufficio: string,
    username: string,
    password: string,
    autorizzazioni: string,
  ) {
    let updatedUsers: User[];
    const newUser =
    {
      id: null,
      idutcas: null,
      DataCreazione: new Date(),
      collaudatoreufficio: collaudatoreufficio,
      username: username,
      password: password,
      autorizzazioni: autorizzazioni,
      commessa: 'commessa',
    }
    return this.users$
      .pipe(
        take(1),
        switchMap(users => {
          updatedUsers = [...users];
          return this.http
            .post(
              `${environment.apiUrl}/cu/`,
              {
                "collaudatoreufficio": collaudatoreufficio,
                "username": username,
                "password": password,
                "autorizzazioni": autorizzazioni === 'user' ? 1 : 2,
              },
              { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
            );
        }),
        catchError(err => { return throwError(err); }),
        tap(res => {
          console.log('GeneratedId:', res['insertId']);
          newUser.id = res['insertId'];
          // TODO: l'api deve restituire anche l'idutcas al momento della create
          // newUser.idutcas = res['idutcas'];
          updatedUsers.unshift(newUser);
          this.usersSubject.next(updatedUsers);
        })
      );
  }

  /** UPDATE utenti */
  updateUser(
    collaudatoreufficio: string,
    username: string,
    password: string,
    userId: number
  ) {
    let updatedUsers: User[];
    return this.users$
      .pipe(
        take(1),
        switchMap(users => {
          const userIndex = users.findIndex(user => user.id === userId);
          updatedUsers = [...users];
          const oldUser = updatedUsers[userIndex];
          updatedUsers[userIndex] =
          {
            id: oldUser.id,
            idutcas: oldUser.idutcas,
            DataCreazione: oldUser.DataCreazione,
            collaudatoreufficio: collaudatoreufficio,
            username: username,
            password: password,
            autorizzazioni: oldUser.autorizzazioni, //TODO: rendere modificabile
            commessa: oldUser.commessa, //TODO: per ora non esiste backend, modificabile
          };
          return this.http
            .put(
              `${environment.apiUrl}/uu/`,
              {
                "collaudatoreufficio": collaudatoreufficio,
                "username": username,
                "password": password,
                // "autorizzazioni": autorizzazioni,
                // "commessa": commessa,
                "id": userId,
              },
              { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
            );
        }),
        catchError(err => { return throwError(err); }),
        tap(res => { this.usersSubject.next(updatedUsers) })
      );
  }

  /** DELETE utenti */
  deleteUser(
    userId: number
  ) {
    let updatedUsers: User[];
    return this.users$
      .pipe(
        take(1),
        switchMap(users => {
          updatedUsers = users.filter(user => user.id !== userId);
          return this.http
            .post(
              `${environment.apiUrl}/d/`,
              {
                "id": userId,
                "tableDelete": 'utenti',
              },
              { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
            );
        }),
        catchError(err => { return throwError(err); }),
        tap(res => { this.usersSubject.next(updatedUsers) })
      );
  }
}
