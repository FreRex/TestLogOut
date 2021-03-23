import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

export interface User {
  collaudatoreufficio: string;
  username: string;
  password: string;
  autorizzazioni: number;
  id?: number;
  checkGis?: number;
  roles?: string[]
}

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private usersSubj = new BehaviorSubject<User[]>([]);
  users$: Observable<User[]> = this.usersSubj.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  loadUsers() {
    this.http
      .get<User[]>('https://www.collaudolive.com:9083/s/utenti/', {
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${this.authService.token}`
        ),
      })
      .subscribe((users) => {
        this.usersSubj.next(users);
      });
  }

  getUser(userId: number): Observable<User> {
    return this.users$.pipe(
      take(1),
      map((users: User[]) => {
        return { ...users.find((user) => user.id === userId) };
      })
    );
  }

  addUser(
    collaudatoreufficio: string,
    username: string,
    password: string,
    autorizzazioni: number,
  ) {
    return this.http
      .post(
        `${environment.apiUrl}/cu/`,
        {
          collaudatoreufficio: collaudatoreufficio,
          username: username,
          password: password,
          autorizzazioni: autorizzazioni,
        },

        {
          headers: new HttpHeaders().set(
            'Authorization',
            `Bearer ${this.authService.token}`
          ),
        }
      )
      .pipe(
        tap((res) => {
          this.loadUsers();
        })
      );
  }

  updateUser(
    collaudatoreufficio: string,
    username: string,
    password: string,
    id:number
  ) {
    return this.http
      .put(
        `${environment.apiUrl}/uu/`,
        {
          collaudatoreufficio: collaudatoreufficio,
          username: username,
          password: password,
          id: id,
        },
        {
          headers: new HttpHeaders().set(
            'Authorization',
            `Bearer ${this.authService.token}`
          ),
        }
      )
      .pipe(
        tap((res) => {
          this.loadUsers();
        })
      );
  }

  deleteUser(userId: number) {
    return this.http
      .post(
        `${environment.apiUrl}/d/`,
        {
          id: userId,
          tableDelete: 'utenti',
        },
        {
          headers: new HttpHeaders().set(
            'Authorization',
            `Bearer ${this.authService.token}`
          ),
        }
      )
      .pipe(
        tap((res) => {
          this.loadUsers();
        })
      );
  }
  
  getUserIdByName(name: string): number {
    let userID: number;
    this.users$.pipe(
      take(1),
      map((users: User[]) => {
        return { ...users.find(user => user.collaudatoreufficio === name) };
      }))
      .subscribe(user => userID = user.id);
    return userID;
    }
}
