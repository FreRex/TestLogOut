import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
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
  datasincro? : Date;
  nodi_fisici?: string;
  nodi_ottici?: string;
  tratte?: string;
  conn_edif_opta?: string;
  idutente?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  private projSubject = new BehaviorSubject<Project[]>([]);
  projects$: Observable<Project[]> = this.projSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService
  ) { }

  getProject(projectId: number): Observable<Project> {
    return this.projects$
      .pipe(
        take(1),
        map((projects: Project[]) => {
          return { ...projects.find(project => project.idprogetto === projectId) };
        })
      );
  }

  getProjectsByFilter(query: string): Observable<Project[]> {
    return this.projects$
      .pipe(
        map((projects: Project[]) => {
          return projects.filter((proj) =>
            proj.nome.toLowerCase().includes(query.toLowerCase()) ||
            proj.collaudatoreufficio.toLowerCase().includes(query.toLowerCase()) ||
            proj.pk_proj.toString().toLowerCase().includes(query.toLowerCase())
          )
        })
      )
  }

  /** SELECT progetti */
  loadProjects(): Observable<Project[]> {
    return this.http
      .get<Project[]>(`${environment.apiUrl}/s/progetti/`,
        { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
      ).pipe(
        tap(projects => {
          this.projSubject.next(projects);
        })
      );
  }

  /** CREATE progetti */
  addProject(
    collaudatoreufficio: string,
    pk_proj: number,
    nome: string,
    nodi_fisici: string,
    nodi_ottici: string,
    tratte: string,
    conn_edif_opta: string,
    long_centro_map: string,
    lat_centro_map: string,
  ) {
    let updatedProjetcs: Project[];
    const newProject =
    {
      idprogetto: null,
      collaudatoreufficio: collaudatoreufficio,
      pk_proj: pk_proj,
      nome: nome,
      long_centro_map: long_centro_map,
      lat_centro_map: lat_centro_map,
      nodi_fisici: nodi_fisici,
      nodi_ottici: nodi_ottici,
      tratte: tratte,
      conn_edif_opta: conn_edif_opta,
    }
    return this.projects$
      .pipe(
        take(1),
        switchMap(projects => {
          updatedProjetcs = [...projects];
          return this.http
            .post(
              `${environment.apiUrl}/cp/`,
              {
                "idutente": this.userService.getUserIdByName(collaudatoreufficio),
                "pk_proj": pk_proj,
                "nome": nome,
                "nodi_fisici": nodi_fisici,
                "nodi_ottici": nodi_ottici,
                "tratte": tratte,
                "conn_edif_opta": conn_edif_opta,
                "long_centro_map": long_centro_map,
                "lat_centro_map": lat_centro_map,
              },
              { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
            );
        }),
        catchError(err => { return throwError(err); }),
        tap(res => {
          console.log('GeneratedId:', res['insertId']);
          newProject.idprogetto = res['insertId'];
          updatedProjetcs.unshift(newProject);
          this.projSubject.next(updatedProjetcs);
        })
      );
  }

  /** UPDATE progetti */
  updateProject(
    idprogetto: number,
    collaudatoreufficio: string,
    pk_proj: number,
    nome: string,
    long_centro_map: string,
    lat_centro_map: string
  ) {
    let updatedProjetcs: Project[];
    return this.projects$
      .pipe(
        take(1),
        switchMap(projects => {
          const projectIndex = projects.findIndex(proj => proj.idprogetto === idprogetto);
          updatedProjetcs = [...projects];
          const oldProject = updatedProjetcs[projectIndex];
          updatedProjetcs[projectIndex] =
          {
            idprogetto: oldProject.idprogetto,
            collaudatoreufficio: collaudatoreufficio,
            pk_proj: pk_proj,
            nome: nome,
            long_centro_map: long_centro_map,
            lat_centro_map: lat_centro_map,
            nodi_fisici: oldProject.nodi_fisici,
            nodi_ottici: oldProject.nodi_ottici,
            tratte: oldProject.tratte,
            conn_edif_opta: oldProject.conn_edif_opta,
          };
          return this.http
            .put(
              `${environment.apiUrl}/up/`,
              {
                "id": idprogetto,
                "idutente": this.userService.getUserIdByName(collaudatoreufficio),
                "pk_proj": pk_proj,
                "nome": nome,
                "long_centro_map": long_centro_map,
                "lat_centro_map": lat_centro_map,
              },
              { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
            );
        }),
        catchError(err => { return throwError(err); }),
        tap(res => { this.projSubject.next(updatedProjetcs) })
      );
  }

  /** DELETE progetti */
  deleteProject(
    projectId: number
  ) {
    let updatedProjetcs: Project[];
    return this.projects$
      .pipe(
        take(1),
        switchMap(projects => {
          updatedProjetcs = projects.filter(proj => proj.idprogetto !== projectId);
          return this.http
            .post(
              `${environment.apiUrl}/d/`,
              {
                id: projectId,
                tableDelete: 'rappre_prog_gisfo',
              },
              { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
            );
        }),
        catchError(err => { return throwError(err); }),
        tap(res => { this.projSubject.next(updatedProjetcs) })
      );
  }



}
