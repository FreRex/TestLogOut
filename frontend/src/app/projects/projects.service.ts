import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from './project.model';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private _projects: Project[] = [
    {
      id: 1,
      usermobile: '1',
      nome_progetto: 'Progetto 1',
      nome_collaudatore: 'Collaudatore 1',
      data_inserimento: new Date(2021, 3, 1),
    },
    {
      id: 2,
      usermobile: '2',
      nome_progetto: 'Progetto 2',
      nome_collaudatore: 'Collaudatore 2',
      data_inserimento: new Date(2021, 3, 2),
    },
    {
      id: 3,
      usermobile: '3',
      nome_progetto: 'Progetto 3',
      nome_collaudatore: 'Collaudatore 3',
      data_inserimento: new Date(2021, 3, 3),
    },
  ];

  projectsChanged = new Subject<Project[]>();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /** Ritorna tutti i progetti */
  getProjects() {
    return this._projects.slice();  // <-- slice() = crea una copia dell'array
    // return [...this.projects];        // <-- Spread Operator = ritorna i singoli valori dell'array = crea una copia dell'array
  }

  // getProjectsFiltered(collaudatore: string) {
  //   return {
  //     ...this._projects.filter(proj => {
  //       return proj.nome_collaudatore === collaudatore;
  //     })
  //   };
  // }

  // TODO : sostituire proprietà id del progetto a usermobile
  getProjectById(id: string): Project {
    return {
      ...this._projects.find(proj => {   // <-- ritorna una copia del progetto con lo spread operator
        return proj.usermobile === id;  // <-- ritorna vero quando trova il progeto giusto
      })
    };
  }

  /** Cancella un progetto */
  deleteProject(id: string) {
    this._projects = this._projects.filter(proj => {  // <-- filter() = filtra un array in base a una regola ("se è vero")
      return proj.usermobile !== id;                // <-- ritrorna vero per tutte le ricette tranne quella che voglio scartare
    });
    this.projectsChanged.next(this._projects.slice());
  }

  /** Salva un progetto dopo una modifica */
  saveProject(id: number, usermobile: string, nome_progetto: string, nome_collaudatore: string) {
    const index = this._projects.findIndex(proj => {
      return proj.usermobile === usermobile;
    });
    this._projects[index] = new Project(id, usermobile, nome_progetto, nome_collaudatore, new Date());
    this.projectsChanged.next(this._projects.slice());
  }

  // createProject(newProject: Project) {
  //   this._projects.push(newProject);
  //   this.projectsChanged.next(this._projects.slice());
  // }

  /** Aggiunge un nuovo progetto alla lista */
  addProject(id: number, usermobile: string, nome_progetto: string, nome_collaudatore: string) {
    const newProject = new Project(id, usermobile, nome_progetto, nome_collaudatore, new Date());
    this._projects.push(newProject);
    this.projectsChanged.next(this._projects.slice());
  }

  /** Aggiorna e sostituisce i progetti con quelli restituiti dal server */
  fetchProjects() {
    this._projects = [];

    return this.http
      .get<Project>(
        'https://www.collaudolive.com:9083/s/room/'
      )
      .pipe(
        map(
          resData => {
            for (const key in resData) {
              console.log(key);
              console.log(resData[key]);
              if (resData.hasOwnProperty(key)) {
                this._projects.push(
                  new Project(
                    resData[key].id,
                    resData[key].usermobile,
                    resData[key].progettoselezionato,
                    resData[key].collaudatoreufficio,
                    resData[key].DataInsert,
                    )
                  );
              }
            }
          }
        )
      );
  }

}
