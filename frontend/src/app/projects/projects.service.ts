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
      usermobile: '1',
      progetto: 'Progetto 1',
      collaudatore: 'Collaudatore 1',
      linkprogetto: 'Link progetto 1',
    },
    {
      usermobile: '2',
      progetto: 'Progetto 2',
      collaudatore: 'Collaudatore 2',
      linkprogetto: 'Link progetto 2',
    },
    {
      usermobile: '3',
      progetto: 'Progetto 3',
      collaudatore: 'Collaudatore 3',
      linkprogetto: 'Link progetto 3',
    },
  ];
  projectsChanged = new Subject<Project[]>();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getProjects() {
    return this._projects.slice();  // <-- slice() = crea una copia dell'array
    // return [...this.projects];        // <-- Spread Operator = ritorna i singoli valori dell'array = crea una copia dell'array
  }

  getProjectsFiltered(collaudatore: string) {
    return {
      ...this._projects.filter(proj => {
        return proj.collaudatore === collaudatore;
      })
    };
  }

  // TODO : sostituire proprietà id del progetto a usermobile
  getProjectById(id: string): Project {
    return {
      ...this._projects.find(proj => {   // <-- ritorna una copia del progetto con lo spread operator
        return proj.usermobile === id;  // <-- ritorna vero quando trova il progeto giusto
      })
    };
  }

  deleteProject(id: string) {
    this._projects = this._projects.filter(proj => {  // <-- filter() = filtra un array in base a una regola ("se è vero")
      return proj.usermobile !== id;                // <-- ritrorna vero per tutte le ricette tranne quella che voglio scartare
    });
    this.projectsChanged.next(this._projects.slice());
  }

  saveProject(usermobile: string, progetto: string, collaudatore?: string, linkprogetto?: string) {
    const id = this._projects.findIndex(proj => {
      return proj.usermobile === usermobile;
    });
    this._projects[id] = new Project(usermobile, progetto, collaudatore, linkprogetto);
    this.projectsChanged.next(this._projects.slice());
  }

  createProject(newProject: Project) {
    this._projects.push(newProject);
    this.projectsChanged.next(this._projects.slice());
  }

  addProject(usermobile: string, progetto: string, collaudatore?: string, linkprogetto?: string) {
    const newProject = new Project(usermobile, progetto, collaudatore, linkprogetto);
    this._projects.push(newProject);
    this.projectsChanged.next(this._projects.slice());
  }

  /**
   * Aggiorna e sostituisce i progetti con quelli restituiti dal server
   */
  fetchProjects() {
    this._projects = [];

    return this.http
      .get<Project>(
        'https://www.collaudolive.com:9083/apimultistreaming'
      )
      .pipe(
        map(
          resData => {
            for (const key in resData) {
              console.log(key);
              console.log(resData[key]);

              if (resData.hasOwnProperty(key)) {
                this._projects.push({ ...resData[key], id: key });
              }
            }
          }
        )
      );
  }

}
