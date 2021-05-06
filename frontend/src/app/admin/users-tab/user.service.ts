import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, first, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface UserData {
  id: number;
  idutcas: string;
  DataCreazione: string;
  collaudatoreufficio: string;
  username: string;
  password: string;
  autorizzazioni: number;
  idcommessa: number;
  commessa: string;
}

export interface User {
  id: number;
  idutcas: string;
  DataCreazione: Date;
  collaudatoreufficio: string;
  username: string;
  password: string;
  idautorizzazione: number;
  autorizzazione: string;
  idcommessa: number;
  commessa: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private usersSubject = new BehaviorSubject<User[]>([]);
  users$: Observable<User[]> = this.usersSubject.asObservable();

  constructor(
    private http: HttpClient
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
          user.commessa.toString().toLowerCase().includes(query.toLowerCase()) ||
          user.username.toString().toLowerCase().includes(query.toLowerCase()) ||
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

  getUserByCod(cod: string) {
    return this.users$.pipe(first(user => user['idutcas'] === cod));
  }

  /** SELECT utenti */
  loadUsers(): Observable<User[]> {
    return this.http
      .get<UserData[]>(
        `${environment.apiUrl}/s/utenti/`
      ).pipe(
        // <-- Rimappa i dati che arrivano dal server sull'interfaccia della Room
        map(data => {
          const users: User[] = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              users.push({
                id: data[key].id,
                idutcas: data[key].idutcas,
                DataCreazione: new Date(data[key].DataCreazione),
                collaudatoreufficio: data[key].collaudatoreufficio,
                username: data[key].username,
                password: data[key].password,
                idautorizzazione: data[key].autorizzazioni,
                autorizzazione: this.getAutorizzazioneById(+data[key].autorizzazioni),
                idcommessa: data[key].idcommessa,
                commessa: data[key].commessa,
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

  getAutorizzazioneById(idautorizzazione: number) {
    switch (idautorizzazione) {
      case 1:
        return 'admin'
      case 2:
        return 'user'
      case 3:
        return 'supervisor'
      default:
        return 'user'
    }
  }

  /** CREATE utenti */
  addUser(
    collaudatoreufficio: string,
    username: string,
    password: string,
    idautorizzazione: number,
    idcommessa: number,
    commessa: string,
  ) {
    console.log();

    let updatedUsers: User[];
    const newUser =
    {
      id: null,
      idutcas: null,
      DataCreazione: new Date(),
      collaudatoreufficio: collaudatoreufficio,
      username: username,
      password: password,
      idautorizzazione: idautorizzazione,
      autorizzazione: this.getAutorizzazioneById(+idautorizzazione),
      idcommessa: idcommessa,
      commessa: commessa,
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
                "autorizzazioni": +idautorizzazione,
                "idcommessa": +idcommessa,
              }
            );
        }),
        catchError(err => { return throwError(err); }),
        tap(res => {
          console.log('GeneratedId:', res['insertId']);
          newUser.id = res['insertId'];
          // TODO: l'api deve restituire anche l'idutcas al momento della create
          newUser.idutcas = 'gg';
          // newUser.idutcas = res['idutcas'];
          updatedUsers.unshift(newUser);
          this.usersSubject.next(updatedUsers);
        })
      );
  }

  /** UPDATE utenti */
  updateUser(
    idutente: number,
    collaudatoreufficio: string,
    username: string,
    password: string,
    idautorizzazione: number,
    idcommessa: number,
    commessa: string,
  ) {
    let updatedUsers: User[];
    console.log(idautorizzazione);
    console.log(this.getAutorizzazioneById(+idautorizzazione));

    return this.users$
      .pipe(
        take(1),
        switchMap(users => {
          const userIndex = users.findIndex(user => user.id === idutente);
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
            idautorizzazione: idautorizzazione,
            autorizzazione: this.getAutorizzazioneById(+idautorizzazione),
            idcommessa: idcommessa,
            commessa: commessa,
          };
          return this.http
            .put(
              `${environment.apiUrl}/uu/`,
              {
                "id": idutente,
                "collaudatoreufficio": collaudatoreufficio,
                "username": username,
                "password": password,
                "autorizzazioni": +idautorizzazione,
                "idcommessa": +idcommessa,
              }
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
              }
            );
        }),
        catchError(err => { return throwError(err); }),
        tap(res => { this.usersSubject.next(updatedUsers) })
      );
  }
}
