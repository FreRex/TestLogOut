import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User{
  collaudatoreufficio: string;
  username: string;
  password: string;
  autorizzazioni: number;
  id?: number;
  checkGis?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersSubj = new BehaviorSubject<User[]>([]);
  users$: Observable<User[]> = this.usersSubj.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  loadUsers(){
    this.http
      .get<User[]>(
        'https://www.collaudolive.com:9083/s/utenti/'
      ).subscribe(
        users =>{
          this.usersSubj.next(users);
        }
      )
  }
}
