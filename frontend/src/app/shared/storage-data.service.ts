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

export interface Project{
  id: number;
  idutente: number;
  pk_proj: number;
  nome: string;
  long_centro_map: string;
  lat_centro_map: string;
  nodi_fisici?: string;
  nodi_ottici?: string;
  tratte?: string;
  conn_edif_opta?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorageDataService{

  private projSubj = new BehaviorSubject<Project[]>([]);
  private usersSubj = new BehaviorSubject<User[]>([]);
  projects$: Observable<Project[]> = this.projSubj.asObservable();
  users$: Observable<User[]> = this.usersSubj.asObservable();

  constructor(
    private http:HttpClient
    ) {
    }

  init(){
    this.loadProjects();
    this.loadUsers();
  }

  loadProjects(){
    this.http
      .get<Project[]>(
        'https://www.collaudolive.com:9083/s/progetti/'
      ).subscribe(
        projects =>{
          this.projSubj.next(projects);
        }
      )
  }

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
