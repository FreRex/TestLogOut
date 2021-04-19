import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable, throwError } from 'rxjs';
import { catchError, delay, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

export interface ProjectData {
  idprogetto: number;
  collaudatoreufficio: string;
  pk_proj: number;
  nome: string;
  datasincro: Date;
  nodi_fisici: string;
  nodi_ottici: string;
  tratte: string;
  conn_edif_opta: string;
  long_centro_map: string;
  lat_centro_map: string;
  idutente: number;
}

export interface Project {
  idprogetto: number;
  collaudatoreufficio: string;
  pk_proj: number;
  nome: string;
  datasincro: Date;
  nodi_fisici: string;
  nodi_ottici: string;
  tratte: string;
  conn_edif_opta: string;
  long_centro_map: string;
  lat_centro_map: string;
  // idutente: number;
  sync: string;
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
      .get<ProjectData[]>(`${environment.apiUrl}/s/progetti/`,
        { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
      ).pipe(
        // <-- Rimappa i dati che arrivano dal server sull'interfaccia della Room
        map(data => {
          const projects: Project[] = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              projects.push({
                idprogetto: data[key].idprogetto,
                collaudatoreufficio: data[key].collaudatoreufficio,
                pk_proj: data[key].pk_proj,
                nome: data[key].nome,
                datasincro: data[key].datasincro,
                nodi_fisici: data[key].nodi_fisici,
                nodi_ottici: data[key].nodi_ottici,
                tratte: data[key].tratte,
                conn_edif_opta: data[key].conn_edif_opta,
                long_centro_map: data[key].long_centro_map.replace(' ', '').trim(),
                lat_centro_map: data[key].lat_centro_map.replace(' ', '').trim(),
                // idutente: data[key].idprogetto,
                sync: (data[key].conn_edif_opta === 'CollaudoLiveGisfo:view_connessione_edificio_pta' ? 'auto' : 'manual'),
              });
            }
          }
          return projects;
        }),
        tap((projects: Project[]) => this.projSubject.next(projects))
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
      datasincro: new Date(),
      nodi_fisici: nodi_fisici,
      nodi_ottici: nodi_ottici,
      tratte: tratte,
      conn_edif_opta: conn_edif_opta,
      long_centro_map: long_centro_map,
      lat_centro_map: lat_centro_map,
      sync: 'manual',
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
            datasincro: oldProject.datasincro,
            nodi_fisici: oldProject.nodi_fisici,
            nodi_ottici: oldProject.nodi_ottici,
            tratte: oldProject.tratte,
            conn_edif_opta: oldProject.conn_edif_opta,
            long_centro_map: long_centro_map,
            lat_centro_map: lat_centro_map,
            sync: oldProject.sync,
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
