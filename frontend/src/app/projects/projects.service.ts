import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from './project.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private projects: Project[] = [
    {
      usermobile: '1',
      progetto: 'string',
      linkprogetto: 'string',
      collaudatore: 'string'
    }
  ];

  constructor(private http: HttpClient) { }

  getProjects() {
    // return this.projects.slice();  // <-- slice() = crea una copia dell'array
    return [...this.projects];        // <-- Spread Operator = ritorna i singoli valori dell'array = crea una copia dell'array
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
  }

  getProjectsFiltered(collaudatore: string) {
    return {
      ...this.projects.filter(proj => {
        return proj.collaudatore === collaudatore;
      })
    };
  }

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
