import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Project{
  collaudatoreufficio: string;
  pk_proj: number;
  nome: string;
  long_centro_map: string;
  lat_centro_map: string;
  id?: number;
  nodi_fisici?: string;
  nodi_ottici?: string;
  tratte?: string;
  conn_edif_opta?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projSubj = new BehaviorSubject<Project[]>([]);
  projects$: Observable<Project[]> = this.projSubj.asObservable();

  constructor(
    private http: HttpClient
  ) { }

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
}
