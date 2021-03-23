import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
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

  getProjects(projectId: number): Observable<Project> {
    return this.projects$.pipe(
      take(1),
      map((projects: Project[]) => {
        return { ...projects.find((project) => project.id === projectId) };
      })
    );
  }

  updateProject(
    id: number,
    idutente: number,
    pk_proj: number,
    nome: string,
    long_centro_map: string,
    lat_centro_map: string
  ) {
    console.log("chiamata");

    return this.http
      .put(
        `${environment.apiUrl}/up/`,
        {
          id: +id,
          idutente: +idutente,
          pk_proj: +pk_proj,
          nome: nome,
          long_centro_map: long_centro_map,
          lat_centro_map: lat_centro_map
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
          console.log("res", res);

          this.loadProjects();
        })
      );
  }

  loadProjects(): Observable<Project[]> {
    return this.http
      .get<Project[]>(
        `${environment.apiUrl}/s/progetti/`,
        { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
      )
      .pipe(tap(projects => { this.projSubj.next(projects); }));
  }
}
