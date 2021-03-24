import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { UserService } from '../users/user.service';

export interface Project {
  idprogetto: number;
  collaudatoreufficio: string;
  pk_proj: number;
  nome: string;
  long_centro_map: string;
  lat_centro_map: string;
  nodi_fisici?: string;
  nodi_ottici?: string;
  tratte?: string;
  conn_edif_opta?: string;
  idutente?:number;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projSubj = new BehaviorSubject<Project[]>([]);
  projects$: Observable<Project[]> = this.projSubj.asObservable();

  constructor(private http: HttpClient,
    private authService: AuthService
    ) {}

  getProjects(projectId: number): Observable<Project> {
    return this.projects$.pipe(
      take(1),
      map((projects: Project[]) => {
        return { ...projects.find((project) => project.idprogetto === projectId) };
      })
    );
  }

  updateProject(
    idprogetto: number,
    idutente: number,
    pk_proj: number,
    nome: string,
    long_centro_map: string,
    lat_centro_map: string
  ) {
    return this.http
      .put(
        `${environment.apiUrl}/up/`,
        {
          "id": idprogetto,
          "idutente": idutente,
          "pk_proj": pk_proj,
          "nome": nome,
          "long_centro_map": long_centro_map,
          "lat_centro_map": lat_centro_map,
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
          this.loadProjects();
        })
      );
  }

  loadProjects() {
    this.http
      .get<Project[]>(`${environment.apiUrl}/s/progetti/`,
        {headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${this.authService.token}`
          ),
        })
      .subscribe(projects => {
        this.projSubj.next(projects);
      });
  }

  deleteProject(progectId: number) {
    return this.http
      .post(
        `${environment.apiUrl}/d/`,
        {
          id: progectId,
          tableDelete: 'rappre_prog_gisfo',
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
          this.loadProjects();
        })
      );
  }

  addProject(
    idutente: number,
    pk_proj: number,
    nome: string,
    nodi_fisici: string,
    nodi_ottici: string,
    tratte: string,
    conn_edif_opta: string,
    long_centro_map: string,
    lat_centro_map: string
  ) {
    return this.http
      .post(
        `${environment.apiUrl}/cp/`,
        {
          "idutente": idutente,
          "pk_proj": pk_proj,
          "nome": nome,
          "nodi_fisici": nodi_fisici,
          "nodi_ottici": nodi_ottici,
          "tratte": tratte,
          "conn_edif_opta": conn_edif_opta,
          "long_centro_map": long_centro_map,
          "lat_centro_map": lat_centro_map,
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
          this.loadProjects();
        })
      );
  }

}
