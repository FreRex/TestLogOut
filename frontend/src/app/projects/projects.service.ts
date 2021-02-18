import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from './project.model';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private projects: Project[] = [
    {
      usermobile: '1',
      progetto: 'Progetto 1',
      linkprogetto: 'Link progetto 1',
      collaudatore: 'Collaudatore 1'
    },
    {
      usermobile: '2',
      progetto: 'Progetto 2',
      linkprogetto: 'Link progetto 2',
      collaudatore: 'Collaudatore 2'
    },
    {
      usermobile: '3',
      progetto: 'Progetto 3',
      linkprogetto: 'Link progetto 3',
      collaudatore: 'Collaudatore 3'
    },
  ];

  projectsChanged = new Subject<Project[]>();
  
  constructor(private http: HttpClient) { }

  getProjects() {
    return this.projects.slice();  // <-- slice() = crea una copia dell'array
    // return [...this.projects];        // <-- Spread Operator = ritorna i singoli valori dell'array = crea una copia dell'array
  }

  // TODO : sostituire proprietà id del progetto a usermobile
  getProjectById(id: string): Project {
    return {
      ...this.projects.find(proj => {   // <-- ritorna una copia del progetto con lo spread operator
        return proj.usermobile === id;  // <-- ritorna vero quando trova il progeto giusto
      })
    };
  }

  deleteProject(id: string) {
    this.projects = this.projects.filter(proj => {  // <-- filter() = filtra un array in base a una regola ("se è vero")
      return proj.usermobile !== id;                // <-- ritrorna vero per tutte le ricette tranne quella che voglio scartare
    });
    this.projectsChanged.next(this.projects.slice());
  }

  saveProject(newProject: Project) {
    const id = this.projects.findIndex(proj => {   
        return proj.usermobile === newProject.usermobile;  
      });
    this.projects[id] = newProject;
    this.projectsChanged.next(this.projects.slice());
  }

  createProject(newProject: Project) {
    this.projects.push(newProject);
    this.projectsChanged.next(this.projects.slice());
  }

  getProjectsFiltered(collaudatore: string) {
    return {
      ...this.projects.filter(proj => {
        return proj.collaudatore === collaudatore;
      })
    };
  }

  /**
   * Aggiorna e sostituisce i progetti con quelli restituiti dal server
   */
  fetchProjects() {
    this.projects = [];
    
    return this.http
      .get<Project>(
        'https://www.collaudolive.com:9083/ApiSsl'
      )
      .pipe(
        map(
          resData => {
            for (const key in resData) {
              console.log(key);
              console.log(resData[key]);

              if (resData.hasOwnProperty(key)) {
                this.projects.push({ ...resData[key], id: key });
              }
            }
          }
        )
      );
  }

}
