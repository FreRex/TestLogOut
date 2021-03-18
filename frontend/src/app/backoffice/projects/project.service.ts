import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

export interface Project {
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
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // loadProjects(){
  //   this.http
  //     .get<Project[]>(
  //       'https://www.collaudolive.com:9083/s/progetti/'
  //     ).subscribe(
  //       projects => { 
  //         this.projSubj.next(projects); 
  //       }
  //     )
  // }

  loadProjects(): Observable<Project[]> {
    return this.http
      .get<Project[]>(
        `${environment.apiUrl}/s/progetti/`,
        { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
      )
      .pipe(tap(projects => { this.projSubj.next(projects); }));
  }
}
