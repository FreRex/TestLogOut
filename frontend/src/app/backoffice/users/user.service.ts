import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

export interface User {
  collaudatoreufficio: string;
  username: string;
  password: string;
  autorizzazioni: number;
  id?: number;
  checkGis?: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersSubj = new BehaviorSubject<User[]>([]);
  users$: Observable<User[]> = this.usersSubj.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  loadUsers(){
    this.http
      .get<User[]>(
        'https://www.collaudolive.com:9083/s/utenti/',{
          headers: new HttpHeaders().set(
            'Authorization',
            `Bearer ${this.authService.token}`
          ),
        }
      ).subscribe(
        users =>{
          this.usersSubj.next(users);
        }
      )
  }

  // loadUsers(): Observable<User[]> {
  //   return this.http
  //     .get<User[]>(`${environment.apiUrl}/s/utenti/`, {
  //       headers: new HttpHeaders().set(
  //         'Authorization',
  //         `Bearer ${this.authService.token}`
  //       ),
  //     })
  //     .pipe(
  //       tap((users) => {
  //         this.usersSubj.next(users);
  //       })
  //     );
  // }

  addUser(
    collaudatoreufficio: string,
    username: string,
    password: string,
    autorizzazioni: number
  ) {
    return this.http.post(
      `${environment.apiUrl}/cu/`,
      {
        collaudatoreufficio: collaudatoreufficio,
        username: username,
        password: password,
        autorizzazioni: autorizzazioni
      },

      {
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${this.authService.token}`
        ),
      }
    ).pipe(tap(res=>{
      this.loadUsers();

    }))
    ;
  }

  deleteUser(userId:number){
    return this.http.post(
      `${environment.apiUrl}/d/`,
      {
        "id" : userId,
        "tableDelete" : "utenti"
      },
      {
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${this.authService.token}`
        ),
      }
    ).pipe(tap(res=>{
      this.loadUsers();
    }));

  }

}
