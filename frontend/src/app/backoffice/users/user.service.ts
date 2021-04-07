import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

export interface User {
  collaudatoreufficio: string;
  username: string;
  password: string;
  autorizzazioni: number;
  DataCreazione? : Date;
  id?: number;
  checkGis?: number;
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

  getUserIdByName(name: string): number {
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

  /** SELECT utenti */
  loadUsers(): Observable<User[]> {
    return this.http
      .get<User[]>('https://www.collaudolive.com:9083/s/utenti/',
        { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
      ).pipe(
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
    autorizzazioni: number,
  ) {
    let updatedUsers: User[];
    const newUser =
    {
      id: null,
      collaudatoreufficio: collaudatoreufficio,
      username: username,
      password: password,
      autorizzazioni: autorizzazioni,
      checkGis: null //TODO: cosa passare?
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
                "autorizzazioni": autorizzazioni,
              },
              { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
            );
        }),
        catchError(err => { return throwError(err); }),
        tap(res => {
          console.log('GeneratedId:', res['insertId']);
          newUser.id = res['insertId'];
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
            collaudatoreufficio: collaudatoreufficio,
            username: username,
            password: password,
            autorizzazioni: oldUser.autorizzazioni,
            checkGis: oldUser.checkGis
          };
          return this.http
            .put(
              `${environment.apiUrl}/uu/`,
              {
                "collaudatoreufficio": collaudatoreufficio,
                "username": username,
                "password": password,
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
