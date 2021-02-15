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
      usermobile: 'string',
      progetto: 'string',
      linkprogetto: 'string',
      collaudatore: 'string'
    }
  ];

  constructor(private http: HttpClient) { }

  getProjects() {
    // return this.projects.slice(); // <-- .slice() = crea una copia dell'array
    return [...this.projects]; // <-- Spread Operator = ritorna i singoli valori dell'array = crea una copia dell'array
  }

  getProjectsFiltered(collaudatore: string) {
    return {
      ...this.projects.filter(proj => {
        return proj.collaudatore === collaudatore;
      })
    };
  }

  fetchProjects() {
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
